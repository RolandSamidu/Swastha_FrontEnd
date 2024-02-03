import React, { Component } from 'react'
import { Button, Grid, Divider, Typography } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any } from 'prop-types'
import { dateParse, convertTocommaSeparated, POnumberToName, roundDecimal } from 'utils'
import PrintIcon from '@mui/icons-material/Print'

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

class POPrint extends Component {
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
            key: 0,
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
            return convertTocommaSeparated(roundDecimal(convertion, 2), 4, 2)
        } else {
            return ''
        }
    }

    handleBeforePrint = () => {
        const pageCount = Math.ceil(this.componentRef.current.offsetHeight / window.innerHeight);
        this.setState({ totalPages: pageCount});
    };

    handlePrintClick = () => {
        // Increment the key to trigger a re-render of PrintComponent
        this.setState(prevState => ({
            key: prevState.key + 1,
        }));
    };

    render() {
        const documentData = this.props.POData
        const itemData = this.props.itemData.current

        // const totalPayable = parseFloat(documentData?.total_payable ?? 0);
        // const freightCharges = parseFloat(documentData?.freight_chargers ?? 0);
        // const handlingAndPackagingCharges = parseFloat(documentData?.handl_and_packaging_charge ?? 0);
        // const otherCharge = parseFloat(documentData?.other_charge ?? 0);

        const subTotal = parseFloat(documentData?.sub_total ?? 0);

        const totalDiscount = parseFloat(documentData?.total_discount ?? 0);
        const totalTax = parseFloat(documentData?.total_tax ?? 0);

        const pureSubTotal = subTotal + totalDiscount - totalTax

        let discountAmount = 0;
        if (documentData && documentData?.ItemsDetails && documentData?.ItemsDetails.length > 0) {
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
        if (documentData && documentData?.ItemsDetails && documentData?.ItemsDetails.length > 0) {
            taxAmount = documentData.ItemsDetails.reduce((acc, item) => {
                const taxAmount = item?.itemData?.taxAmount;
                if (taxAmount !== undefined) {
                    return acc + taxAmount;
                } else {
                    return acc;
                }
            }, 0);
        }

        let signature = ''
        let finalTotal = parseFloat(documentData?.total_payable) * parseFloat(documentData?.exchange_rate ?? 1);

        if (parseFloat(finalTotal) < 50000000) {
            signature = "Procurement Officer";
        } else if (parseFloat(finalTotal) >= 50000000 && parseFloat(finalTotal) < 500000000) {
            signature = 'Manager Imports';
        } else {
            signature = "DGM";
        }

        const { type, tax, discount, total, PONo, condition } = this.props
        // console.log("🚀 ~ file: PO.js:54 ~ PO ~ render ~ documentData:", documentData);
        console.log("🚀 ~ file: PO.js:54 ~ PO ~ render ~ documentData:", documentData);
        console.log("🚀 ~ file: PO.js:54 ~ PO ~ render ~ documentData:", itemData);
        /*  size: 297mm 420mm, */

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

        .page-break {
            page-break-before: always;
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

        // .filler-row tr {
        //     height: 100vh; /* Allow row to expand as needed */
        // }

        // .filler-cell {
        //     border: 1px solid black; /* Add top border for visual separation */
        // }

        // .item-footer tr {
        //     display: none; /* Hide the footer row by default */
        // }

        @media print {
            // .item-footer tr {
            //     display: table-footer-group;
            // }

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
                // page-break-inside: avoid;
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
                <Grid className="hidden ">
                    <ReactToPrint
                        // key={this.state.key}
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
                        // documentTitle={`PO_${PONo}`}
                        // onBeforeGetContent={this.handlePrintClick}
                        content={() => this.componentRef.current}
                        />
                </Grid>
                <Grid className="bg-light-gray p-5 hidden">
                    {/* <style>{pageStyle}</style> */}
                    <div className="bg-white p-5">
                        <div>
                            <div ref={this.componentRef} className='clear-floats' key={this.state.key}>
                                <table>
                                    <thead className="report-header">
                                        <tr>
                                            <th className="report-header-cell">
                                                <div className="header-info">
                                                    <span>INDENT NO:{documentData?.indent_no}</span>
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
                                                                                {documentData?.po_type === 'F' ? 'INDENT' : 'Purchase Order'}
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
                                                                            documentData?.Category?.description !== "Pharmaceutical" ?
                                                                            (
                                                                                <>
                                                                                    dgmsurgical@spc.lk<br/>
                                                                                    mgrsurgical@spc.lk<br/>
                                                                                    prodhslab@spc.lk<br/>
                                                                                </>
                                                                            )
                                                                            :
                                                                            (
                                                                                <>
                                                                                    dgmpharma@spc.lk<br/>
                                                                                    pharma.manager@spc.lk<br/>
                                                                                    imp_sup@spc.lk<br/>
                                                                                    profficerpharma@spc.lk<br/>
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
                                                                : {documentData?.po_no ? documentData?.po_no: ""}
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData?.tender_no? documentData?.tender_no : ''}
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData?.hs_code ? documentData?.hs_code : ''}
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData?.Supplier?.name ? documentData?.Supplier?.name : ""}<br />
                                                            </p>
                                                            <p style={f1_css}>
                                                                : {documentData?.Supplier?.address ? documentData?.Supplier?.address : ''}
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
                                                                : {documentData?.order_no ? documentData?.order_no:''}
                                                            </p>
                                                            <p style={f1_b_css}>
                                                                : {documentData?.indent_no ? documentData?.indent_no : ""}
                                                            </p>
                                                            <p style={f1_css}>
                                                                :{' '}
                                                                {documentData?.inco_terms ? documentData?.inco_terms ==="L" ? "Local" : documentData?.inco_terms: ''}
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
                                                                <p style={{ ...f1_b_css, flex: 1, textAlign:"left" }}>
                                                                    IMPORT LICENSE NO :
                                                                    {
                                                                        documentData?.import_license_no ? documentData?.import_license_no : ''
                                                                    }
                                                                </p>
                                                                <p style={{...f1_b_css, flex: 1}}>
                                                                    VALID UP TO :
                                                                    {documentData?.valid_date ? dateParse(
                                                                        documentData?.valid_date):""
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
                                                                            documentData?.payment_terms ? 
                                                                            ` ${documentData?.payment_terms}`  : ''          // ${documentData?.payment_terms_short} - 
                                                                        }
                                                                    </p>
                                                                </Grid>
                                                                {documentData?.po_type === 'F' ? 
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
                                                                                    documentData?.mode_of_dispatch ? documentData?.mode_of_dispatch.replace(" & ", " or ") : ''
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
                                                                        <p style={f1_css}>
                                                                            : {documentData?.Bank_Detail?.bank}
                                                                        </p>
                                                                        <p style={f1_css}>
                                                                            {documentData?.Bank_Detail?.address_line1} <br />
                                                                            {documentData?.Bank_Detail?.address_line2} <br />
                                                                            {documentData?.Bank_Detail?.address_line3}
                                                                        </p>
                                                                </Grid>
                                                            </Grid>
                                                        </>

                                                    {/* Table */}
                                                    <Grid item xs={12}>
                                                        <table style={{ width: '100%' }} className='items'>
                                                            {/* <tfoot className="item-footer">
                                                                <tr className='filler-row'>
                                                                    <td colSpan="6" className="filler-cell"></td>
                                                                </tr>
                                                            </tfoot> */}
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
                                                                        Unit Price ({documentData?.quoted_unit_price}){' '}{documentData?.currency_short}
                                                                    </th>
                                                                    <th className='items-th'
                                                                        style={{
                                                                            width: '20%',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Total {documentData?.currency_short}
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {itemData && itemData
                                                                                    .slice() // Create a copy of the array to avoid mutating the original
                                                                                    .sort((a, b) => a?.rowData?.ItemSnap?.sr_no - b?.rowData?.ItemSnap?.sr_no) // Sort by sr_no
                                                                                    .map((item, i) => {
                                                                    const itemTotal = parseFloat(item?.itemData?.total) || 0; 
                                                                    const itemDiscountType = item?.itemData?.discountType; 
                                                                    const itemDiscount = parseFloat(item?.itemData?.discount) || 0;
                                                                    const itemTax = parseFloat(item?.itemData?.taxAmount) || 0;
                                                                    const itemQuantity = parseFloat(item?.itemData?.orderQuantity) || 0;
                                                                    const itemUnit = parseFloat(item?.itemData?.unit) || 0;
                                                                    const itemPrice = parseFloat(item?.itemData?.price) || 0;

                                                                    const calculatedValue = ( itemQuantity / itemUnit ) * itemPrice

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
                                                                            {documentData?.Category?.description !== "Pharmaceutical" && 
                                                                                <p style={{textAlign:"center"}}>({i + 1})</p>
                                                                            }
                                                                        </td>
                                                                        <td className='items-td'>
                                                                            {documentData?.Category?.description === "Pharmaceutical" ? 
                                                                                <>
                                                                                    {
                                                                                        item?.itemData?.remark && (
                                                                                            <>
                                                                                                <p style={{pageBreakInside:"avoid"}}>
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
                                                                                                <p style={{pageBreakInside:"avoid"}}>
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
                                                                                            <p style={{pageBreakInside:"avoid"}}>
                                                                                                <b>MSD Specification</b>
                                                                                                <RenderedContent HTML={item?.itemData?.specification} />
                                                                                            </p>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    item?.itemData?.remark && (
                                                                                        <>
                                                                                            <p style={{pageBreakInside:"avoid"}}>
                                                                                                <b>Offered Items</b>
                                                                                                <RenderedContent HTML={item?.itemData?.remark} />
                                                                                            </p>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                                </>
                                                                            }
                                                                            {
                                                                                item?.itemData?.type === 'Warranty' ? 
                                                                                item?.itemData?.shelfLife && (<>
                                                                                    <span style={f1_b_css}>Warranty:</span>
                                                                                    <span style={f1_css}>{item?.itemData?.shelfLife}</span>
                                                                                </>)
                                                                                :
                                                                                item?.itemData?.shelfLife && (<>
                                                                                    <span style={f1_b_css}>Shelf Life:</span>
                                                                                    <span style={f1_css}>{item?.itemData?.shelfLife}</span>
                                                                                </>)
                                                                            }

                                                                            {/* {item.itemData.shelfLife && (<>
                                                                                <p style={f1_b_css}>Shelf Life:</p>
                                                                                <p style={f1_css}>{item?.itemData?.shelfLife}</p>
                                                                            </>)} */}

                                                                            {item?.itemData?.manufacture && <p style={f1_b_css}>Manufacturer:</p>}
                                                                            {item?.itemData?.manufacture && <p style={f1_css}>{item?.itemData?.manufacture?.name}</p>}

                                                                            {item.itemData.countryOfOrigin && (<>
                                                                                <span style={f1_b_css}><br/>Country of Origin: </span>
                                                                                <span style={f1_css}>{item.itemData?.countryOfOrigin?.description}</span>
                                                                            </>)
                                                                            }

                                                                            {/* Delivery Schedule */}
                                                                            {item?.itemData?.deliverySchedule && item?.itemData?.deliverySchedule.length > 0 && <p style={f1_b_css}>Delivery Schedule:</p>}
                                                                            {item?.itemData?.deliverySchedule && item?.itemData?.deliverySchedule.map((data, i) => {
                                                                                // return data.deliveryLocation ? <p key={i}>Location - {data.deliveryLocation} </p> : <></>
                                                                                return (
                                                                                    <p key={i} style={f1_css}>{`${convertTocommaSeparated(data?.quantity, 0)} ${item?.itemData?.unitType} ${data?.sheduleDate ? ", Date: " + dateParse(data?.sheduleDate): ""} ${data?.remark ? ", Remark: " + data?.remark: "" } ${data?. deliveryLocation ? ", Location: " + data?.deliveryLocation :""}`}</p>
                                                                                )
                                                                            })}

                                                                        </td>
                                                                        <td className='items-td'>
                                                                            <p style={f1_css_center}>{parseInt(item?.itemData?.orderQuantity / packSize, 10)}</p>
                                                                            <br/>
                                                                            <p style={f1_css_center}>{"("} {item?.itemData?.packingDetails.map(item => item.UOM).join(' X ')} {")"}</p>
                                                                            <p style={f1_css_center}>{"("} {item?.itemData?.packingDetails.map(item => convertTocommaSeparated(item.packSize, 0)).join(' X ')} {")"}</p>
                                                                        </td>
                                                                        <td className='items-td'>
                                                                            <p style={f1_css_center}>{convertTocommaSeparated(item?.itemData?.orderQuantity, 0)}</p>
                                                                            <p style={f1_css_center}>{item?.itemData?.unitType}</p>
                                                                        </td>
                                                                        <td className='items-td'>
                                                                            <p style={f1_css_center}>{`${convertTocommaSeparated(roundDecimal(item?.itemData?.price, 4), 4, 4)} Per ${item?.itemData?.unit} of ${item?.itemData?.unitType}`}</p>

                                                                        </td>
                                                                        <td className='items-td' style={{ textAlign: 'right', }}>
                                                                            <p style={f1_css}>{`${convertTocommaSeparated(roundDecimal(calculatedValue, 2), 4, 2)}`}</p>
                                                                                <div style={{display:"flex", flexDirection:"row", marginTop:"0.5rem"}}>
                                                                                    {itemDiscount !== 0 && 
                                                                                    <>
                                                                                    {itemDiscountType === "percentage" ? 
                                                                                        <>
                                                                                            <span style={{ margin: 0, fontSize: '12px', textAlign:"left", flex:1}}>
                                                                                                {`Discount (${itemDiscount})%: `}
                                                                                            </span> 
                                                                                            <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${convertTocommaSeparated(roundDecimal((itemDiscount/100) * calculatedValue, 2 ), 4, 2)} `}
                                                                                            </span>
                                                                                        </>
                                                                                        
                                                                                        : 
                                                                                        <>
                                                                                            <span style={{ margin: 0, fontSize: '12px', textAlign:"left", flex:1}}>
                                                                                                {`Discount: `}
                                                                                            </span>
                                                                                            <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${convertTocommaSeparated(roundDecimal(itemDiscount, 2), 4, 2)} `}
                                                                                            </span>
                                                                                        </>
                                                                                    }
                                                                                    </>
                                                                                    }
                                                                                </div> 
                                                                                <div style={{display:"flex", flexDirection:"row", marginTop:"0.5rem"}}>
                                                                                    {itemTax !== 0 && <>
                                                                                        <span style={{ margin: 0, fontSize: '12px', textAlign: "left", flex: 1 }}>{`Tax (${item?.itemData?.taxPercentage ? item?.itemData?.taxPercentage : 0})%: `}
                                                                                        </span>
                                                                                        <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${convertTocommaSeparated(roundDecimal(itemTax, 2), 4, 2)}`}
                                                                                        </span>
                                                                                    </>}
                                                                                </div>
                                                                            {/* <p style={f1_css}>{`${convertTocommaSeparated(itemTotal, 2, 4)}`}</p> */}

                                                                            {/* <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.subTotal, 2, 4)}`}</p>
                                                                            {item?.itemData?.discount && <p style={{ ...f1_css_center, marginTop: "0.5rem" }}>{`Discount ( ${item?.itemData?.discount})%: ${convertTocommaSeparated((parseFloat(item?.itemData?.discount)* item?.itemData.subTotal)/100, 4, 4)} `}</p>}
                                                                            {item?.itemData?.taxAmount && <p style={{ ...f1_css_center, marginTop: "0.5rem" }}>{`Tax ( ${item?.itemData?.taxPercentage})%: ${convertTocommaSeparated(item?.itemData?.taxAmount, 4, 4)} `}</p>}
                                                                            <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.total, 4, 4)}`}</p> */}
                                                                        </td>
                                                                    </tr>
                                                                })}
                                                                </tbody>
                                                                <tbody style={{pageBreakInside:"avoid"}}>
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
                                                                        Sub total ({documentData?.quoted_unit_price})
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {convertTocommaSeparated(roundDecimal(pureSubTotal, 2), 4, 2)}
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
                                                                        {convertTocommaSeparated(roundDecimal(documentData?.total_tax, 2), 4, 2)}
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
                                                                        {convertTocommaSeparated(roundDecimal(documentData?.total_discount, 2), 4, 2)}
                                                                    </td>
                                                                </tr>
                                                                {documentData?.po_type === 'F' && 
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
                                                                            Grand Total ({documentData?.quoted_unit_price})
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                            }}
                                                                        >
                                                                            {/* {convertTocommaSeparated(total, 2)} */}
                                                                            {convertTocommaSeparated(roundDecimal(subTotal, 2), 4, 2)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                {documentData?.po_type === 'F' && 
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
                                                                            {convertTocommaSeparated(roundDecimal(documentData?.freight_chargers, 2), 4, 2)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                {
                                                                    documentData?.po_type === 'F' &&
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
                                                                            {convertTocommaSeparated(roundDecimal(documentData?.handl_and_packaging_charge, 2), 4, 2)}
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
                                                                            {convertTocommaSeparated(roundDecimal(documentData?.other_charge, 2), 4, 2)}
                                                                        </td>
                                                                    </tr>
                                                                {
                                                                    documentData?.po_type === 'F' && 
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
                                                                            Final Total (C&F)     {/*{documentData?.quoted_unit_price}*/}
                                                                        </td>
                                                                        <td className='items-td'
                                                                            style={{
                                                                                textAlign: 'right',
                                                                            }}
                                                                        >
                                                                            {convertTocommaSeparated(roundDecimal(documentData?.total_payable, 2), 4, 2)}
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                {documentData?.po_type === 'F' && 
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
                                                                        Commission {documentData?.commission_precentage}%
                                                                    </td>
                                                                    <td className='items-td'
                                                                        style={{
                                                                            textAlign: 'right',
                                                                        }}
                                                                    >
                                                                        {convertTocommaSeparated(roundDecimal(documentData?.commission, 2), 4, 2)}
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
                                                                        {convertTocommaSeparated(roundDecimal(documentData?.grand_total, 2), 4, 2)}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </Grid>
                                                    {/* exchange rate  */}
                                                    <Grid item xs={12} container style={{pageBreakInside:"avoid"}}>
                                                        <Grid item xs={12}>
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
                                                                <p style={f1_css}>{documentData?.exchange_rate ? roundDecimal(documentData?.exchange_rate, 4) : ''}</p>
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <p style={f1_b_css}>as at</p>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <p style={f1_css}>
                                                                    {documentData?.currency_date ? dateParse(documentData?.currency_date) : ''}
                                                                </p>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <p style={f1_b_css}>= LKR {this.convertPrice(documentData?.exchange_rate, documentData?.total_payable)} </p>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid item xs={12} container>
                                                            <Grid item xs={4}>
                                                                <p style={f1_b_css}>Total Value in {documentData?.currency !== 'LKR' ? "Foreign Currency" : "LKR"}</p>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <p style={f1_b_css}>{documentData?.currency}</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p style={f1_b_css}>{POnumberToName(documentData?.total_payable)}</p>      {/* roundDecimal(documentData?.total_payable, 2) */}
                                                            </Grid>
                                                        </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider />
                                                        <p>SPECIAL CONDITIONS</p>
                                                        <RenderedContent HTML={documentData?.notes} />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12}>
                                                        <Divider />
                                                        <p>MSD CONDITIONS</p>
                                                        <RenderedContent HTML={documentData?.additional_conditions} />
                                                    </Grid>

                                                    {documentData?.po_type === 'F' ? (
                                                        <Grid item xs={12}>
                                                            <Divider />
                                                            <p>Shipping Conditions</p>
                                                            <RenderedContent HTML={condition} />
                                                        </Grid>
                                                    ): 
                                                    <>
                                                    {documentData?.Category?.description !== "Pharmaceutical" && 
                                                        <Grid item xs={12}>
                                                                <Divider />
                                                                {/* <RenderedContent HTML={local_conditions(itemData ? itemData.map(item => `${item?.itemData?.manufacture?.name} OF ${item?.itemData?.manufacture?.company}`): [], documentData?.tender_no ? documentData?.tender_no : 'N/A')} /> */}
                                                                <RenderedContent HTML={condition} />
                                                            </Grid>
                                                    }
                                                    </>}

                                                    {/* <Grid item xs={12}>
                                                        {MSDConditionsList && MSDConditionsList.map((rs, i) => {
                                                            return <p key={i}>{rs.description}</p>
                                                        })}
                                                    </Grid> */}

                                                    {documentData?.LocalAgent && documentData?.po_type === 'F' && (
                                                        <Grid item xs={12} style={{marginTop:"10px"}}>
                                                            <p style={f1_b_css}>Local Agent Details</p>
                                                            <p style={f1_css}>Name: &nbsp;{documentData?.LocalAgent?.name} </p>
                                                            <p style={f1_css}>Company: &nbsp;{documentData?.LocalAgent?.company} </p>
                                                            <p style={f1_css}>Contact No: &nbsp;{documentData?.LocalAgent?.contact_no} </p>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </td>
                                        </tr>
                                        {/* <tr className='filler-row'>
                                            <td colSpan="5"></td>
                                        </tr> */}
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

export default POPrint
