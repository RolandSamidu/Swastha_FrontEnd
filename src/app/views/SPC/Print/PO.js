import React, { Component } from 'react'
import { Button, Grid, Divider, Typography } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any } from 'prop-types'
import { dateParse, convertTocommaSeparated, numberToName, POnumberToName, roundDecimal } from 'utils'
import PrintIcon from '@mui/icons-material/Print'

const foreign_conditions = (orderNo, INDENT, ItemsDetails) => {
    return (
        `<ol>
            <style>
                li {
                    text-align: justify;
                }
                .shipping-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                p{
                    margin: 0
                }
                .shipping-details {
                    flex: 1;
                    padding: 10px;
                }
                .center {
                    display: block;
                    margin: 10px auto;
                    width: 20%;
                }
            </style>
            <li>Please treat this as a firm and confirmed award. L/C in your favour covering the value of this Indent is being established with validity up to ... and will be forwarded to you in due course. Please prepare goods for despatch within L/C validity.</li>
            <li>Supply should be from freshly manufactured stocks.</li>
            <li>'DHS' mark to be embossed/printed on each tablet or capsule.</li>
            <li>Batch numbers and relevant quantity, date of manufacture and date of expiry (where applicable) should be indicated on Invoice, packing List and Certificate of Analysis.</li>
            <li>As per conditions of tender 'At least 85% residual shelf life should remain at time of shipment/dispatch. We reserve the right to call for free replacement for goods supplied with inadequate residual shelf life.</li>
            <li>Pack labels should be printed with item code number ("SR number" given) and the "Republican State Mark" (shown below).</li>
            <Grid item xs={12} container spacing={2} alignContent='center'>
                <Grid item xs={12}>
                    <img
                        src="/assets/images/spc_logo.png"
                        alt="Ministry Logo"
                        class="center"
                    ></img>
                </Grid>
            </Grid>
            <li>Documents should be addressed to "the State Pharmaceuticals Corporation of Sri Lanka, P.O. Box 1757, Colombo, Sri Lanka".</li>
            <li>All documents should be manually signed in ink. Photostat copies or stamped or duplicated signatures on invoices and other documents are not acceptable to our Customs, Import Control and Exchange Control.</li>
            <li>Please courier/fax direct to us immediately after despatch, 6 copies of Invoices, 3 copies of Bill of Lading/Air Waybill, 4 copies of Packing Lists, 1 copy of Certificate of Origin, and 1 copy of Quality Certificate.</li>
            <li>It is very essential that your Invoices should indicate separately the FOB and freight charges to total the C & F Invoice Value.</li>
            <li>Gross weight in kg. and total volume and outer measurement (in cu.cm.) for the total consignment should be shown on Bill of lading/Air Waybill as well as on Invoice.</li>
            <li>Where a consignment is not entirely made up of one homogenous type of packing, please show the relevant details of nett weight, gross weight, case dimensions and volume for the number of packages of each type of casing used.</li>
            <li>If for some reason you are unable to meet the delivery date indicated, cable, telex or fax your reasons immediately.</li>
            <li>The packing should be suitable for storage and use under tropical conditions. Humidity in Sri Lanka will be between 75% and 100% and temperature will be in the range of 80°F to 90°F (27°C to 35°C). Outer packing should be in strong seaworthy wooden or corrugated boxes. Any variation in packing should receive our prior approval.</li>
            <li>The CFR Colombo price quoted by you and referred to in the Indent includes packing, freight and all other charges for the despatch of the supplies to Colombo, Sri Lanka and no increases in rates quoted will be permitted.</li>
            <li>A certificate of Quality, Quantity and Loading which should state that the supplies despatched conform to the Quality, Quantity, Size, Weight and sort specified in the Indent and Annexure, should be obtained by you at the time of despatch from SGS/ITALAB/manufacturer at your expense.</li>
            <li>In the case of drugs requiring refrigeration or cold storage, shipping documents including Bill of Lading/Air Waybill must indicate that Refrigeration is required. All packages, cartons must be clearly marked in block letters "REFRIGERATION CARGO" giving recommended storage temperature.</li>
            <li>The packages should be marked with two Blue Band Vertical and Horizontal on each face to enable easy identification of Government Cargo on arrival in the Colombo Harbour. They should also bear the following shipping marks</li>
            <div class="shipping-container">
                <div class="shipping-details">
                    <p variant='body2' align='center'>DGHS</p>
                    <p variant='body2' align='center'>C/O.STATE PHARMACEUTICALS CORPORATION</p>
                    <p variant='body2' align='center'>${orderNo}</p>
                    <p variant='body2' align='center'>SR No: ${Array.isArray(ItemsDetails) && ItemsDetails.length > 0 ? ItemsDetails.length === 1 ? ItemsDetails?.[0]?.rowData?.ItemSnap?.sr_no: "As per the Indent": ""}</p>
                </div>
                <div class="shipping-details">
                    <p variant='body2' align='center'>DGHS</p>
                    <p variant='body2' align='center'>INDENT NO: ${INDENT}</p>
                    <p variant='body2' align='center'>SPC/CMB</p>
                    <p variant='body2' align='center'>To be marked else where in the Package</p>
                </div>
            </div>
            <li><b>PROHIBITION OF IMPORTATION OF RICE STRAW AND OTHER VEGETABLE MATTER AS PACKING MATERIAL UNDER THE PLANT PROTECTION ORDINANCE.</b><br/>
                Under regulations framed under the Plant Protection Ordinance Chapter 447, the use of Rice Straw and other such vegetable matter as packing material is prohibited.</li>
            <li>It is essential that this Award is acknowledged by return Fax/Telex.</li>
        </ol>`
    );
}

const local_conditions = (supplier, tenderNo) => {
    return (
        `<div style={{ border: "1px solid #ccc", margin:"5px" }}>
            <style>
                li {
                    text-align: justify;
                }
            </style>
            <p>Delivery Date : ..................</p>
            <p>Delivery Address : The Director, Medical Supplies Division, 355, Deans Road, Colombo 10.</p>
            <ul>
                <li>Each batch supplied should be covered by the ${supplier?.name} Quality certificate. This certificate should also certify that the goods supplied conform to the required  standards  and the specifications given in buyer’s purchase order and that the goods are suitable for intended use.</li>
                <li>Quality of goods should strictly conform to the samples submitted against our tender reference ${tenderNo} OF ${dateParse(new Date())}. We reserve the right to ask you to replace the goods free of charge or to reimburse the value of  goods in the event of quality failure found by the end user or if goods do not confirm to the samples submitted.</li>
                <li>Payment will be made after <b>30/45/60</b> Days from the date of delivery. The commercial invoices should be raised in two (02)
                originals. One original Invoice should be handed over to the Director/ M.S.D with the goods. The other original Invoice duly
                acknowledged by D-M.S.D or his authorized ofiicer with frank stamped; to be submitted to S.P.C for payment.
                </li>
            </ul>
        </div>`
    );
}

const f1_css = {
    margin: 0,
    fontSize: '12px',
}

const f1_css_center = {
    margin: 0,
    fontSize: '12px',
    textAlign: 'center'
}

const f1_b_css = {
    margin: 0,
    fontSize: '12px',
    fontWeight: 600,
}
const RenderedContent = ({ HTML }) => {
    const imgStyles = {
        display: 'block',
        margin: '10px auto',
        width: '20%',
        height: '20%'
    };

    const liStyles = {
        textAlign: 'justify',
    };

    const splitIndex = 4; // The index at which to split the groups

    // Function to apply the styles to the <img> tag
    const applyStyles = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const imgElement = doc.querySelector('img');
        if (imgElement) {
        Object.keys(imgStyles).forEach((styleKey) => {
            imgElement.style[styleKey] = imgStyles[styleKey];
        });
        }

        const liElements = doc.querySelectorAll('li');
            liElements.forEach((liElement) => {
            Object.keys(liStyles).forEach((styleKey) => {
                liElement.style[styleKey] = liStyles[styleKey];
            });
        });

    //     const paragraphGroups = doc.querySelectorAll('p + p');
    //     if (paragraphGroups.length >= splitIndex) {
    //         const externalDiv = document.createElement('div');
    //         externalDiv.style.display = 'flex';
    //         externalDiv.style.justifyContent = 'space-between';
    //         externalDiv.style.marginTop = '10px';
    //         externalDiv.style.marginBottom = '10px';

    //         // Create and append inner divs for the first and second halves of the content
    //         const div1 = document.createElement('div');
    //         const div2 = document.createElement('div');

    //         div1.style.flex = '1';
    //         div1.style.padding = '10px';

    //         div2.style.flex = '1';
    //         div2.style.padding = '10px';

    //         // Append the first half of groups to the first inner div
    //         for (let i = 0; i < splitIndex; i++) {
    //             const groupClone = paragraphGroups[i].cloneNode(true);
    //             div1.appendChild(groupClone);
    //         }

    //         // Append the second half of groups to the second inner div
    //         for (let i = splitIndex; i < paragraphGroups.length; i++) {
    //             const groupClone = paragraphGroups[i].cloneNode(true);
    //             div2.appendChild(groupClone);
    //         }

    //         // Append the inner divs to the external div
    //         externalDiv.appendChild(div1);
    //         externalDiv.appendChild(div2);

    //         // Insert the external div at the exact location of the original content
    //         const originalContentContainer = paragraphGroups[0].parentNode;
    //         const referenceNode = paragraphGroups[paragraphGroups.length - 1].nextSibling;
    //         originalContentContainer.insertBefore(externalDiv, referenceNode);
    //     }

    //     paragraphGroups.forEach((paragraph) => {
    //         paragraph.parentNode.removeChild(paragraph);
    //     });
        return doc.documentElement.innerHTML;
    };

    // Check if HTML content exists and apply styles
    if (HTML) {
        const updatedHTML = applyStyles(HTML.toString('html'));
        return (
        <div style={{ fontSize: '12px' }} dangerouslySetInnerHTML={{ __html: updatedHTML }} />
        );
    } else {
        return <></>;
    }
    // console.log("HTML: ", HTML.toString('html'))
    // return HTML ? <div style={{fontSize:"10px"}} dangerouslySetInnerHTML={{ __html: HTML.toString('html') }} /> : <></>
}

class PO extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalPages: 1,
            data: [],
            orderList: [],
            orderId: null,
            orderListId: null,
            userName: null,
            myData: [],

            isScriptLoaded: false
        }

        this.componentRef = React.createRef();
    }

    static propTypes = {
        header: any,
        footer: any,
    }

    static defaultProps = {}

    newlineText(text) {
        if (text) {
            return text.split('\n').map((str) => <p>{str}</p>)
        } else {
            return ''
        }
    }

    convertPrice(rate, value) {
        if (rate && value) {
            let convertion = parseFloat(rate) * parseFloat(value)

            return convertTocommaSeparated(convertion, 4, 4)
        } else {
            return ''
        }
    }

    componentDidMount() {
        // const script = document.createElement('script');
        // script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
        // script.defer = true;
        // script.onload = () => this.setState({ isScriptLoaded: true });
        // document.body.appendChild(script);
    }

    handleBeforePrint = () => {
    const pageCount = Math.ceil(this.componentRef.current.offsetHeight / window.innerHeight);
        this.setState({ totalPages: pageCount });
    };

    render() {
        const { totalPages } = this.state;
        const documentData = this.props.POData.current

        let discountAmount = 0;
        if (documentData && documentData.ItemsDetails && documentData.ItemsDetails.length > 0) {
            discountAmount = documentData.ItemsDetails.reduce((acc, item) => {
                const subTotal = item?.itemData?.subTotal;
                const discount = item?.itemData?.discount;
                if (subTotal !== undefined && discount !== undefined) {
                    const discountTotal = (subTotal * parseFloat(discount))/100;
                    return acc + discountTotal;
                } else {
                    return acc;
                }
            }, 0);
        }

        let taxAmount = 0;
        if (documentData && documentData.ItemsDetails && documentData.ItemsDetails.length > 0) {
            taxAmount = documentData.ItemsDetails.reduce((acc, item) => {
                const taxAmount = item?.itemData?.taxAmount;
                if (taxAmount !== undefined) {
                    return acc + taxAmount;
                } else {
                    return acc;
                }
            }, 0);
        }

        
        const { type, tax, discount, total, PONo, Category } = this.props
        console.log("🚀 ~ file: PO.js:54 ~ PO ~ render ~ documentData:", documentData)
        /*  size: 297mm 420mm, */

        let signature = ''
        let finalTotal = parseFloat(total) * parseFloat(documentData?.exchange_rate ?? 1);

        if (parseFloat(finalTotal) < 50000000) {
            signature = "Procurement Officer";
        } else if (parseFloat(finalTotal ?? 0) >= 50000000 && parseFloat(finalTotal ?? 0) < 500000000) {
            signature = 'Manager Imports';
        } else {
            signature = "DGM";
        }

        const pageStyle = `

        p {
            margin: 0,
            fontSize: 12px,  
        }

        .clear-floats:after {
            content: "";
            display: table;
            clear: both;
        }

        .header-info {
            fontSize: 12px;
            display:flex;
            justify-content: space-between;
        }

        table.items {
            border: 1px solid black;
            border-collapse: collapse;
            border-left: 0;
            border-radius: 4px;
            border-spacing: 0px;
            font-size:12px;
        }

        thead.items-head {
            display: table-header-group;
            vertical-align: middle;
            border-color: inherit;
            border-collapse: collapse;
        }

        tr.items-tr {
            display: table-row;
            vertical-align: inherit;
            border-color: inherit;
        }

        th.items-th,
        td.items-td {
            padding: 5px 4px 6px 4px;
            text-align: left;
            vertical-align: top;
            border-left: 1px solid black;
        }

        td.items-td {
            border-top: 1px solid black;
        }

        thead.items-thead:first-child tr.items-tr:first-child th.items-th:first-child,
        tbody.items-body:first-child tr.items-tr:first-child td.items-td:first-child {
            border-radius: 4px 0 0 0;
        }

        thead.items-thead:last-child tr.items-tr:last-child th.items-th:first-child,
        tbody.items-tobdy:last-child tr.items-tr:last-child td.items-td:first-child {
            border-radius: 0 0 0 4px;
        } 
 
        .report-footer{
            height:35px;
        }
        div.page-footer {
            font-size: 12px;
            position: fixed;
            bottom: -5px;
            width: 100%; 
        }
        
        div.page-footer p {
            margin: 0;
            font-weight: 600;

        }
        
        table.report-container {
            page-break-after: always;
            width: 100%;
        }
        
        thead.report-header {
            margin-bottom: 5px;
            display: table-header-group;
        }
        
        tfoot.report-footer {
            margin-top: 5px;
            display: table-footer-group;
        }
        
        div.footer-info, div.page-footer {
            display: block;
        }

        @media print {
            @page {
                size: auto;
                @top-left{
                    content: none;
                }
                @bottom-right{
                    content: "Page " counter(page) " of " counter(pages);
                }
            }

            @page :header {
                display: none
            }

            @page :footer {
                display: none
            }
            
            tr.items-tr {
                page-break-inside: avoid;
            } 
            
            // div.page-footer, div.footer-info {
            //     display: block;
            // }

            // div.page-footer{
            //     page-break-after: always;
            //     counter-increment: pages;
            //     // counter-reset: page;
            // }

            // div.page-footer::after {
            //     counter-increment: page;
            //     // content: "Page " counter(page) " of " counter(pages);
            // }

            // .header-info:first-child > span {
            //     display: none;
            // }
        }
`
        return (
            <div>
                <ReactToPrint
                    trigger={() => (
                        <Button
                        className='mt-2'
                        id="print_button_006"
                        variant="contained"
                        color="primary"
                        style={{ width: '100%' }}
                        startIcon={<PrintIcon />}
                        >
                            Print PO
                        </Button>
                    )}
                    pageStyle={pageStyle}
                    documentTitle={`PO_${PONo}`}
                    content={() => this.componentRef.current}
                    />
                <Grid className="bg-light-gray p-5 hidden">
                    {/* <style>{pageStyle}</style> */}
                    <div className="bg-white p-5">
                        <div>
                            <div ref={this.componentRef} className='clear-floats'>
                                <table>
                                    <thead className="report-header">
                                        <tr>
                                            <th className="report-header-cell">
                                                <div className="header-info">
                                                    <span>INDENT NO:{documentData.intend?.intentNo}</span>
                                                    <span>[{type}]</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tfoot className="report-footer">
                                        <tr>
                                            <td className="report-footer-cell">
                                                <div className="footer-info">
                                                    <div className={'page-footer'}>
                                                        <p>{signature}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                    <tbody className="report-content">
                                        <tr>
                                            <td className="report-content-cell">
                                                <Grid container  >
                                                    {/* Header */}
                                                    <Grid item xs={12} container spacing={1}>
                                                        <Grid item xs={2}>
                                                            <img
                                                                src="/assets/images/spc.jpeg"
                                                                alt="SPC"
                                                                style={{ width: '100%' }}
                                                            ></img>
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                            <Grid container>
                                                                <Grid item xs={12}>
                                                                    <h5>
                                                                        STATE PHARMACEUTICALS
                                                                        CORPORATION OF SRI LANKA
                                                                    </h5>
                                                                    <p style={f1_css}>
                                                                        16th FLOOR, MEHEWARA
                                                                        PIYASA BUILDING, NO. 41,
                                                                        KIRULA ROAD, COLOMBO 05,
                                                                        SRI LANKA
                                                                    </p>
                                                                </Grid>
                                                                <Grid item xs={8}>
                                                                    <p style={f1_css}>
                                                                        TEL: +94-11-2335374,
                                                                        +94-11-2326227,
                                                                        +94-11-2320256-9
                                                                    </p>
                                                                    <p style={f1_css}>
                                                                        FAX: +94-11-2391537,
                                                                        +94-11-2447118,
                                                                        +94-11-2424427,
                                                                        +94-11-2344082
                                                                    </p>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                width: '30%',
                                                                            }}
                                                                        >
                                                                            <p variant="subtitle1">
                                                                                [{type}]
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                width: '30%',
                                                                            }}
                                                                        >
                                                                            <p
                                                                                style={{
                                                                                    margin: 0,
                                                                                    borderRadius:
                                                                                        '5px',
                                                                                    textAlign:
                                                                                        'center',
                                                                                    padding:
                                                                                        '5px 1rem',
                                                                                    backgroundColor:
                                                                                        '#080202',
                                                                                    color: 'white',
                                                                                }}
                                                                            >
                                                                                {documentData.intend?.POType === 'F' ? 'INDENT' : 'Purchase Order'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={4}>
                                                                    <p style={f1_css}>
                                                                        WEB: www.spc.lk
                                                                    </p>
                                                                    <p style={f1_css}>
                                                                        E-Mail:<br/>

                                                                        {
                                                                            Category === "Pharmaceutical" ?
                                                                            (
                                                                                <>
                                                                                    dgmpharma@spc.lk<br/>
                                                                                    pharma.manager@spc.lk<br/>
                                                                                    imp_sup@spc.lk<br/>
                                                                                    profficerpharma@spc.lk<br/>
                                                                                </>
                                                                            )
                                                                            :
                                                                            (
                                                                                <>
                                                                                    dgmsurgical@spc.lk<br/>
                                                                                    mgrsurgical@spc.lk<br/>
                                                                                    prodhslab@spc.lk<br/>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </p>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    {/* details */}
                                                    <Grid item xs={6} container>
                                                        <Grid item xs={4}>
                                                            <p style={f1_b_css}>PO NO</p>
                                                            <p style={f1_css}>TENDER/Bid Ref</p>
                                                            <p style={f1_css}>H.S. CODE NO</p>
                                                            <p style={f1_css}>Supplier Name</p>
                                                            <p style={f1_css}>Supplier Address</p>
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <p style={f1_b_css}>
                                                                : {PONo}
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData.intend.tenderNo? documentData?.intend.tenderNo : ''}
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData.intend.HSCode ? documentData?.intend.HSCode : ''}
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData?.intend.suppplierDetails?.name ? documentData?.intend?.suppplierDetails?.name : ""}<br />
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData?.intend.suppplierDetails?.address ? documentData?.intend?.suppplierDetails?.address : ''}
                                                            </p>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={6} container>
                                                        <Grid item xs={5}>
                                                            <p style={f1_css}>
                                                                MSD REQUISITION NO
                                                            </p>
                                                            <p style={f1_b_css}>INDENT NO</p>
                                                            <p style={f1_css}>INCOTERMS</p>
                                                            <p style={f1_css}>DATE</p>
                                                        </Grid>
                                                        <Grid item xs={7}>
                                                            <p style={f1_css}>
                                                                : {documentData?.intend?.orderNo ? documentData?.intend?.orderNo:''}
                                                            </p>
                                                            <p style={f1_b_css}>
                                                                : {documentData?.intend?.intentNo ? documentData?.intend?.intentNo : ""}
                                                            </p>
                                                            <p style={f1_css}>
                                                                :{' '}
                                                                {documentData?.intend?.incoTerms ? documentData?.intend?.incoTerms === "L"? "Local" : documentData?.intend?.incoTerms : ''}
                                                            </p>
                                                            <p style={f1_css}>: {dateParse(new Date())}</p>
                                                        </Grid>
                                                    </Grid>

                                                    {/* license No */}
                                                    {/* If bank detail is available */}
                                                        <>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent:
                                                                        'space-evenly',
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                    border: '1px solid black',
                                                                }}
                                                            >
                                                                <p style={{...f1_b_css, flex: 1, textAlign:"left"}}>
                                                                    IMPORT LICENSE NO :
                                                                    {
                                                                        documentData.intend.bankDetails?.importLicenseNo ? documentData.intend.bankDetails
                                                                            ?.importLicenseNo : ''
                                                                    }
                                                                </p>
                                                                <p style={{...f1_b_css, flex:1}}>
                                                                    VALID UP TO :
                                                                    {documentData.intend.bankDetails?.validUpTo ? dateParse(
                                                                        documentData.intend.bankDetails
                                                                            ?.validUpTo):""
                                                                    }
                                                                </p>
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                style={{
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                    border: '1px solid black',
                                                                    margin: '5px 0',
                                                                }}
                                                                container
                                                            >
                                                                <Grid item xs={3}>
                                                                    <p style={f1_b_css}>
                                                                        TERMS OF PAYMENT
                                                                    </p>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <p style={f1_css}>
                                                                        :
                                                                        {
                                                                            documentData?.intend?.paymentTerms?.name ? 
                                                                            documentData?.intend?.paymentTerms?.name : ''
                                                                        }
                                                                    </p>
                                                                </Grid>
                                                                {documentData.intend?.POType === 'F' ? 
                                                                    (<>
                                                                        <Grid item xs={3}>
                                                                            <p style={f1_b_css}>
                                                                                MODE OF DISPATCH
                                                                            </p>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <p style={f1_css}>
                                                                                :{' '}
                                                                                {
                                                                                    Array.isArray(documentData?.intend?.modeOfDispatch) ? documentData?.intend
                                                                                        ?.modeOfDispatch.join(" or ") : ''
                                                                                }
                                                                            </p>
                                                                        </Grid>
                                                                    </>): (
                                                                    <>
                                                                        <Grid item xs={3}>
                                                                            <p style={f1_b_css}></p>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <p style={f1_css}></p>
                                                                        </Grid>
                                                                    </>
                                                                    )
                                                                }

                                                                <Grid item xs={3}>
                                                                    <p style={f1_b_css}>
                                                                        NAME OF BANK
                                                                    </p>
                                                                </Grid>
                                                                <Grid item xs={9}>
                                                                    {documentData.intend.bankDetails?.bank ? <>
                                                                        <p style={f1_css}>
                                                                            : {documentData.intend.bankDetails.bank?.bank}
                                                                        </p>
                                                                        <p style={f1_css}>
                                                                            {documentData.intend.bankDetails.bank?.address_line1} <br />
                                                                            {documentData.intend.bankDetails.bank?.address_line2} <br />
                                                                            {documentData.intend.bankDetails.bank?.address_line3}
                                                                        </p>
                                                                    </>: ""
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    

                                                    {/* Table */}
                                                    <Grid item xs={12}>
                                                        <table style={{ width: '100%' }} className='items'>
                                                            <thead className='items-thead'>
                                                                <tr className='items-tr'>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '10%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        SR No
                                                                    </th>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '40%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Description of Item
                                                                    </th>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '10%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Qty. in Packs
                                                                    </th>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '10%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Order Qty
                                                                    </th>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '10%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Unit Price ({documentData?.intend?.quotedUnitPrice}){' '}{documentData?.intend?.currency?.cc}
                                                                    </th>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '20%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Total {documentData?.intend?.currency?.cc}
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {documentData.ItemsDetails && documentData.ItemsDetails.map((item, i) => {
                                                                    const packSize = item.itemData?.packingDetails
                                                                        .filter((rs) => rs.storingLevel === true)
                                                                        .reduce((accumulator, currentItem) => {
                                                                            if (currentItem.packSize === 0) {
                                                                            return accumulator;
                                                                            }
                                                                            return accumulator * parseInt(currentItem.packSize, 10);
                                                                        }, 1);
                                                                    return <tr key={i} className='items-tr'>
                                                                        <td className='items-td'>
                                                                            <p>{item?.rowData?.ItemSnap?.sr_no}</p>
                                                                            {Category !== 'Pharmaceutical' && 
                                                                                <p style={{textAlign:"center"}}>({i + 1})</p>
                                                                            }
                                                                        </td>
                                                                        <td className='items-td'>
                                                                            {Category === "Pharmaceutical" ? 
                                                                                <>
                                                                                    {
                                                                                        item?.itemData?.remark && (
                                                                                            <>
                                                                                                <p>
                                                                                                    <b>Offered Items</b>
                                                                                                    <RenderedContent HTML={item?.itemData?.remark} />
                                                                                                </p>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    <p>
                                                                                        <b>Medium Description</b><br/>
                                                                                        <span style={{fontSize:"10px"}}>{item?.rowData?.ItemSnap?.medium_description}</span>
                                                                                    </p>
                                                                                    {
                                                                                        item?.itemData?.specification && (
                                                                                            <>
                                                                                                <p style={{fontSize:"12px"}}>
                                                                                                    <b>MSD Specification</b>
                                                                                                    <RenderedContent HTML={item?.itemData?.specification} />
                                                                                                </p>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </>: 
                                                                                <>
                                                                                {
                                                                                    item?.itemData?.specification && (
                                                                                        <>
                                                                                            <p>
                                                                                                <b>MSD Specification</b>
                                                                                                <RenderedContent HTML={item?.itemData?.specification} />
                                                                                            </p>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    item?.itemData?.remark && (
                                                                                        <>
                                                                                            <p>
                                                                                                <b>Offered Items</b>
                                                                                                <RenderedContent HTML={item?.itemData?.remark} />
                                                                                            </p>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                                </>
                                                                            }
                                                                            {
                                                                                item.itemData.type === 'Warranty' ? 
                                                                                item.itemData.shelfLife && (<>
                                                                                    <span style={f1_b_css}>Warranty:</span>
                                                                                    <span style={f1_css}>{item.itemData.shelfLife}</span>
                                                                                </>)
                                                                                :
                                                                                item.itemData.shelfLife && (<>
                                                                                    <span style={f1_b_css}>Shelf Life: </span>
                                                                                    <span style={f1_css}>{item.itemData.shelfLife}</span>
                                                                                </>)
                                                                            }

                                                                            {/* {item.itemData.shelfLife && (<>
                                                                                <p style={f1_b_css}>Shelf Life:</p>
                                                                                <p style={f1_css}>{item?.itemData?.shelfLife}</p>
                                                                            </>)} */}

                                                                            {item.itemData.manufacture && <p style={f1_b_css}>Manufacturer:</p>}
                                                                            {item.itemData.manufacture && <p style={f1_css}>{item.itemData.manufacture?.name}</p>}
                                                                            {item.itemData.countryOfOrigin && (<>
                                                                                <span style={f1_b_css}><br/>Country of Origin: </span>
                                                                                <span style={f1_css}>{item.itemData?.countryOfOrigin?.description}</span>
                                                                            </>)
                                                                            }

                                                                            {/* Delivery Schedule */}
                                                                            {item.itemData.deliverySchedule && item.itemData.deliverySchedule.length > 0 && <p style={f1_b_css}>Delivery Schedule:</p>}
                                                                            {item.itemData.deliverySchedule && item.itemData.deliverySchedule.map((data, i) => {
                                                                                // return data.deliveryLocation ? <p key={i}>Location - {data.deliveryLocation} </p> : <></>
                                                                                return (
                                                                                    <p key={i} style={f1_css}>{`${convertTocommaSeparated(data?.quantity, 0)} ${item?.itemData?.unitType} ${data?.sheduleDate ? ", Date: "+ dateParse(data?.sheduleDate): ""}, ${data?.remark ? ", Remark: " + data?.remark : ""} ${data?. deliveryLocation ? ", Location: "+ data?.deliveryLocation: ""}`}</p>
                                                                                )
                                                                            })}

                                                                        </td>
                                                                        <td className='items-td'>
                                                                            <p style={f1_css_center}>{parseInt(item?.itemData?.orderQuantity / packSize, 10)}</p>
                                                                            <br/>
                                                                            <p style={f1_css_center}>{"("} {item?.itemData?.packingDetails.map(item => item.UOM).join(' X ')} {")"}</p>
                                                                            <p style={f1_css_center}>{"("} {item?.itemData?.packingDetails.map(item => item.packSize).join(' X ')} {")"}</p>
                                                                        </td>
                                                                        <td className='items-td'>
                                                                            <p style={f1_css_center}>{convertTocommaSeparated(item?.itemData?.orderQuantity, 0)}</p>
                                                                            <p style={f1_css_center}>{item?.itemData?.unitType}</p>
                                                                        </td>
                                                                        <td className='items-td'>
                                                                            <p style={f1_css_center}>{`${convertTocommaSeparated(item?.itemData?.price, 4, 4)} Per ${item?.itemData?.unit} of ${item?.itemData?.unitType}`}</p>

                                                                        </td>
                                                                        <td className='items-td' style={{ textAlign: 'right', }}>
                                                                            <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.subTotal, 4, 4)}`}</p>
                                                                                <div style={{display:"flex", flexDirection:"row", marginTop:"0.5rem"}}>
                                                                                    <span style={{ margin: 0, fontSize: '12px', textAlign:"left", flex:1}}>{`Discount ( ${item?.itemData?.discount ? item?.itemData?.discount : 0})%: `}
                                                                                    </span>
                                                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${isNaN(parseFloat(item?.itemData?.discount)) ? '0' : convertTocommaSeparated((parseFloat(item?.itemData?.discount) * item?.itemData.subTotal) / 100, 4, 4)} `}
                                                                                    </span>
                                                                                </div> 
                                                                                <div style={{display:"flex", flexDirection:"row", marginTop:"0.5rem"}}>
                                                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "left", flex: 1 }}>{`Tax ( ${item?.itemData?.taxPercentage ? item?.itemData?.taxPercentage : '0'})%: `}
                                                                                    </span>
                                                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${convertTocommaSeparated(item?.itemData?.taxAmount, 4, 4)}`}
                                                                                    </span>
                                                                                </div>
                                                                            {/* <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.total, 4, 4)}`}</p> */}
                                                                            {/* <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.subTotal, 4, 4)}`}</p>
                                                                            {item?.itemData?.discount && <p style={{ ...f1_css_center, marginTop: "0.5rem" }}>{`Discount ( ${item?.itemData?.discount})%: ${convertTocommaSeparated((parseFloat(item?.itemData?.discount)* item?.itemData.subTotal)/100, 4, 4)} `}</p>}
                                                                            {item?.itemData?.taxAmount && <p style={{ ...f1_css_center, marginTop: "0.5rem" }}>{`Tax ( ${item?.itemData?.taxPercentage})%: ${convertTocommaSeparated(item?.itemData?.taxAmount, 4, 4)} `}</p>}
                                                                            <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.total, 4, 4)}`}</p> */}
                                                                        </td>
                                                                    </tr>
                                                                })}
                                                                <tr className='items-tr'>
                                                                    <td className='items-td' colSpan="2"></td>
                                                                    <td className='items-td'
                                                                        colSpan="3"
                                                                        style={{
                                                                            borderLeft:
                                                                                ' none ',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        Sub total ({documentData?.intend?.quotedUnitPrice})
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {convertTocommaSeparated(documentData?.OthersGeneral?.pureSubTotal, 4, 4)}
                                                                    </td>
                                                                </tr>

                                                                <tr className='items-tr'>
                                                                    <td className='items-td'
                                                                        colSpan="2"
                                                                        style={{
                                                                            borderTop: 'none',
                                                                        }}
                                                                    ></td>
                                                                    <td className='items-td'
                                                                        colSpan="3"
                                                                        style={{
                                                                            borderLeft: 'none',
                                                                            borderTop: 'none',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        Tax
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                        }}
                                                                    >
                                                                        {/* Updated */}
                                                                        {/* {convertTocommaSeparated(tax?.value, 2)} */}
                                                                        {convertTocommaSeparated(taxAmount, 4, 4)}
                                                                    </td>
                                                                </tr>
                                                                <tr className='items-tr'>
                                                                    <td className='items-td'
                                                                        colSpan="2"
                                                                        style={{
                                                                            borderTop: 'none',
                                                                        }}
                                                                    ></td>
                                                                    <td className='items-td'
                                                                        colSpan="3"
                                                                        style={{
                                                                            borderLeft: 'none',
                                                                            borderTop: 'none',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        Discount
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                        }}
                                                                    >
                                                                        {/* Updated */}
                                                                        {/* {convertTocommaSeparated(discount?.value, 2)} */}
                                                                        {isNaN(discountAmount) ? 0 : convertTocommaSeparated(discountAmount, 4, 4)}
                                                                    </td>
                                                                </tr>
                                                                {documentData.intend?.POType === 'F' && 
                                                                    <tr className='items-tr'>
                                                                        <td className='items-td'
                                                                            colSpan="2"
                                                                            style={{
                                                                                borderTop: 'none',
                                                                            }}
                                                                        ></td>
                                                                        <td className='items-td'
                                                                            colSpan="3"
                                                                            style={{
                                                                                borderLeft: 'none',
                                                                                borderTop: 'none',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            Grand Total (C&F)      {/*{documentData?.intend?.quotedUnitPrice}*/}
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                            }}
                                                                        >
                                                                            {/* {convertTocommaSeparated(total, 2)} */}
                                                                            {convertTocommaSeparated(documentData?.OthersGeneral?.subTotal, 4, 4)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                {documentData.intend?.POType === 'F' && 
                                                                    <tr className='items-tr'>
                                                                        <td className='items-td'
                                                                            colSpan="2"
                                                                            style={{
                                                                                borderTop: 'none',
                                                                            }}
                                                                        ></td>
                                                                        <td className='items-td'
                                                                            colSpan="3"
                                                                            style={{
                                                                                borderLeft: 'none',
                                                                                borderTop: 'none',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            Freight Charges
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                                borderTop: 'none',
                                                                            }}
                                                                        >
                                                                            {convertTocommaSeparated(documentData?.OthersGeneral?.freightChargers, 4, 4)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                {
                                                                    documentData.intend?.POType === 'F' &&
                                                                    <tr className='items-tr'>
                                                                        <td className='items-td'
                                                                            colSpan="2"
                                                                            style={{
                                                                                borderTop: 'none',
                                                                            }}
                                                                        ></td>
                                                                        <td className='items-td'
                                                                            colSpan="3"
                                                                            style={{
                                                                                borderLeft: 'none',
                                                                                borderTop: 'none',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            Handling/Packing Charges
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                                borderTop: 'none',
                                                                            }}
                                                                        >
                                                                            {convertTocommaSeparated(documentData?.OthersGeneral?.handlAndPackagingCharge, 4, 4)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                    <tr className='items-tr'>
                                                                        <td className='items-td'
                                                                            colSpan="2"
                                                                            style={{
                                                                                borderTop: 'none',
                                                                            }}
                                                                        ></td>
                                                                        <td className='items-td'
                                                                            colSpan="3"
                                                                            style={{
                                                                                borderLeft: 'none',
                                                                                borderTop: 'none',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            Other Charges
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                                borderTop: 'none',
                                                                            }}
                                                                        >
                                                                            {convertTocommaSeparated(documentData?.OthersGeneral?.otherCharge, 4, 4)}
                                                                        </td>
                                                                    </tr>
                                                                {
                                                                    documentData.intend?.POType === 'F' && 
                                                                    <tr className='items-tr'>
                                                                        <td className='items-td'
                                                                            colSpan="2"
                                                                            style={{
                                                                                borderTop: 'none',
                                                                            }}
                                                                        ></td>
                                                                        <td className='items-td'
                                                                            colSpan="3"
                                                                            style={{
                                                                                borderLeft: 'none',
                                                                                borderTop: 'none',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        >
                                                                            Final Total ({documentData?.intend?.quotedUnitPrice})
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                            }}
                                                                        >
                                                                            {convertTocommaSeparated(total, 4, 4)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                {documentData.intend?.POType === 'F' && 
                                                                <tr className='items-tr'>
                                                                    <td className='items-td'
                                                                        colSpan="2"
                                                                        style={{
                                                                            borderTop: 'none',
                                                                        }}
                                                                    ></td>
                                                                    <td className='items-td'
                                                                        colSpan="3"
                                                                        style={{
                                                                            borderLeft: 'none',
                                                                            borderTop: 'none',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        Commission {documentData?.OthersGeneral?.commission?.percentage}%
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                        }}
                                                                    >
                                                                        {convertTocommaSeparated(documentData?.OthersGeneral?.commission?.value, 4, 4)}
                                                                    </td>
                                                                </tr>
                                                                }
                                                                <tr className='items-tr'>
                                                                    <td className='items-td'
                                                                        colSpan="2"
                                                                        style={{
                                                                            borderTop: 'none',
                                                                        }}
                                                                    ></td>
                                                                    <td className='items-td'
                                                                        colSpan="3"
                                                                        style={{
                                                                            borderLeft: 'none',
                                                                            borderTop: 'none',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        Total Payable to
                                                                        Supplier
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                        }}
                                                                    >
                                                                        {convertTocommaSeparated(documentData?.OthersGeneral?.grandTotal, 4, 4)}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </Grid>

                                                    {/* exchange rate  */}
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        container
                                                        style={{
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            border: '1px solid black',
                                                            margin: '5px 0',
                                                        }}
                                                    >
                                                        <Grid item xs={1}>
                                                            <p style={f1_b_css}>Ex. Rate:</p>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <p style={f1_css}>{documentData?.intend?.exchangeRate ? documentData?.intend?.exchangeRate : ''}</p>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <p style={f1_b_css}>as at</p>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <p style={f1_css}>
                                                                {documentData?.intend?.currencyDate ? documentData?.intend?.currencyDate : ''}
                                                            </p>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <p style={f1_b_css}>= LKR {this.convertPrice(documentData?.intend?.exchangeRate, total)} </p>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12} container>
                                                        <Grid item xs={4}>
                                                            <p style={f1_b_css}>Total Value in {documentData?.intend?.currency?.name !== 'LKR' ? "Foreign Currency" : "LKR"}</p>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <p style={f1_b_css}>{documentData?.intend?.currency?.name}</p>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <p style={f1_b_css}>{POnumberToName(roundDecimal(total, 2))}</p>
                                                        </Grid>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12}>
                                                        <Divider />
                                                        <p>SPECIAL CONDITIONS</p>
                                                        <RenderedContent HTML={documentData?.noteAndAttachment?.note} />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12}>
                                                        <Divider />
                                                        <p>MSD CONDITIONS</p>
                                                        <RenderedContent HTML={documentData?.conditions} />
                                                    </Grid>

                                                    {documentData?.intend?.POType === 'F' ? (
                                                        <Grid item xs={12}>
                                                            <Divider />
                                                            <p>Shipping Conditions</p>
                                                            <RenderedContent HTML={documentData?.shipping_conditions?.condition} />
                                                        </Grid>
                                                    ): 
                                                    <>
                                                    {Category !== 'Pharmaceutical' && 
                                                        <Grid item xs={12}>
                                                            <Divider />
                                                            <RenderedContent HTML={documentData?.shipping_conditions?.condition} />
                                                        </Grid>
                                                    }
                                                    </>
                                                    }
                                                    

                                                    {/* <Grid item xs={12}>
                                                        {MSDConditionsList && MSDConditionsList.map((rs, i) => {
                                                            return <p key={i}>{rs.description}</p>
                                                        })}
                                                    </Grid> */}

                                                    {documentData.intend.localAgent && documentData.intend?.POType === 'F' && (
                                                        <Grid item xs={12} style={{marginTop:"10px"}}>
                                                            <p style={f1_b_css}>Local Agent Details</p>
                                                            <p style={f1_css}>Name: &nbsp;{documentData.intend.localAgent?.name} </p>
                                                            <p style={f1_css}>Company: &nbsp;{documentData.intend.localAgent?.company} </p>
                                                            <p style={f1_css}>Contact No: &nbsp;{documentData.intend.localAgent?.contact_no} </p>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Grid>
            </div>
        )
    }
}

export default PO
