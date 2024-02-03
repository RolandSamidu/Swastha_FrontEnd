import React from 'react'
import { Divider, Grid } from '@material-ui/core'
import { dateParse, convertTocommaSeparated, numberToName, roundDecimal } from 'utils'


const foreign_conditions = (orderNo, INDENT, ItemsDetails) => {
    return (
        `<ul>
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
                    <p variant='body2' align='center'>SR No: ${Array.isArray(ItemsDetails) && ItemsDetails.length > 0 ? ItemsDetails.length === 1 ? ItemsDetails?.[0]?.rowData?.ItemSnap?.sr_no : "As per the Indent" : ""}</p>
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
        </ul>`
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
    return (
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            {HTML ? (
                <div dangerouslySetInnerHTML={{ __html: HTML.toString('html') }} />
            ) : (
                <></>
            )}
        </div>
    );
};

export default function PreviewPO({ POData, tax, discount, total, MSDConditionsList, PONo, type, Category }) {
    const documentData = POData.current;
    console.log("🚀 ~ file: PreviewPO.jsx:30 ~ PreviewPO ~ documentData:", documentData)

    let discountAmount = 0;
    if (documentData && documentData.ItemsDetails && documentData.ItemsDetails.length > 0) {
        discountAmount = documentData.ItemsDetails.reduce((acc, item) => {
            const subTotal = item?.itemData?.subTotal;
            const discount = item?.itemData?.discount;
            if (subTotal !== undefined && discount !== undefined && discount !== "") {
                const discountTotal = (subTotal * parseFloat(discount)) / 100;
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

    const convertPrice = (rate, value) => {
        if (rate && value) {
            let convertion = parseFloat(rate) * parseFloat(value)
            return convertTocommaSeparated(convertion, 2)
        } else {
            return ''
        }
    }
    const tableStyle = {
        border: '1px solid black',
        borderCollapse: 'separate',
        borderLeft: 0,
        borderRadius: '4px',
        borderSpacing: '0px',
        fontSize: '12px',
        width: '100%'
    };

    const theadStyle = {
        display: 'table-header-group',
        verticalAlign: 'middle',
        borderColor: 'inherit',
        borderCollapse: 'separate',
    };

    const trStyle = {
        display: 'table-row',
        verticalAlign: 'inherit',
        borderColor: 'inherit',
    };

    const thStyle = {
        padding: '5px 4px 6px 4px',
        textAlign: 'left',
        verticalAlign: 'top',
        borderLeft: '1px solid black',
    };

    const tdStyle = {
        padding: '5px 4px 6px 4px',
        textAlign: 'left',
        verticalAlign: 'top',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
    };

    if (documentData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '65%' }}>
                    <Grid container>
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
                                            E-Mail:<br />
                                            {
                                                Category === "Pharmaceutical" ?
                                                    (
                                                        <>
                                                            dgmpharma@spc.lk<br />
                                                            pharma.manager@spc.lk<br />
                                                            imp_sup@spc.lk<br />
                                                            profficerpharma@spc.lk<br />
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            dgmsurgical@spc.lk<br />
                                                            mgrsurgical@spc.lk<br />
                                                            prodhslab@spc.lk<br />
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
                                <p style={f1_css}>Supplier</p>
                                <p style={f1_css}>Supplier Address</p>
                            </Grid>
                            <Grid item xs={8}>
                                <p style={f1_b_css}>
                                    : {PONo ? PONo : ""}
                                </p>
                                <p style={f1_css}>
                                    : {documentData?.intend.tenderNo ? documentData?.intend.tenderNo : ''}
                                </p>
                                <p style={f1_css}>
                                    : {documentData?.intend.HSCode ? documentData?.intend.HSCode : ""}
                                </p>
                                <p style={f1_css}>
                                    : {documentData?.intend?.suppplierDetails?.name ? documentData?.intend?.suppplierDetails?.name : ""}
                                </p>
                                <p style={f1_css}>
                                    : {documentData?.intend?.suppplierDetails?.address ? documentData?.intend?.suppplierDetails?.address : ""}
                                </p>
                            </Grid>
                        </Grid>

                        <Grid item xs={6} container>
                            <Grid item xs={5}>
                                <p style={f1_css}>
                                    MSD REQUISITION NO
                                </p>
                                <p style={f1_b_css}>INDENT NO</p>
                                <p style={f1_css}>INCO TERMS</p>
                                <p style={f1_css}>DATE</p>
                            </Grid>
                            <Grid item xs={7}>
                                <p style={f1_css}>
                                    : {documentData?.intend?.orderNo ? documentData?.intend?.orderNo : ''}
                                </p>
                                <p style={f1_b_css}>
                                    : {documentData?.intend?.intentNo ? documentData?.intend?.intentNo : ""}
                                </p>
                                <p style={f1_css}>
                                    : {documentData?.intend?.incoTerms ? documentData?.intend?.incoTerms === "L" ? "Local" : documentData?.intend?.incoTerms : ''}
                                </p>
                                <p style={f1_css}>: {dateParse(new Date())}</p>
                            </Grid>
                        </Grid>

                        {/* license No */}
                        {/* If bank detail is available */}
                        {documentData.intend.bankDetails && (
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
                                    <p style={f1_b_css}>
                                        IMPORT LICENSE NO :
                                        {
                                            documentData.intend.bankDetails
                                                ?.importLicenseNo ? documentData.intend.bankDetails?.importLicenseNo : ''
                                        }
                                    </p>
                                    <p style={f1_b_css}>
                                        VALID UP TO :
                                        {documentData.intend.bankDetails
                                            ?.validUpTo ? dateParse(documentData.intend.bankDetails?.validUpTo) : ''
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
                                            :{' '}
                                            {
                                                documentData?.intend
                                                    ?.paymentTerms?.name
                                            }{' '}
                                        </p>
                                    </Grid>

                                    {
                                        documentData.intend?.POType === 'F' ? (<>
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
                                                            ?.modeOfDispatch.join(" & ") : ''
                                                    }
                                                </p>
                                            </Grid>
                                        </>) : (<>
                                            <Grid item xs={3}>
                                                <p style={f1_b_css}></p>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <p style={f1_css}></p>
                                            </Grid>
                                        </>)
                                    }

                                    <Grid item xs={3}>
                                        <p style={f1_b_css}>
                                            NAME OF BANK
                                        </p>
                                    </Grid>
                                    <Grid item xs={9}>
                                        {documentData.intend.bankDetails.bank ? <>
                                            <p style={f1_css}>
                                                : {documentData.intend.bankDetails.bank?.bank}
                                            </p>
                                            <p style={f1_css}>
                                                {'  '}{documentData.intend.bankDetails?.bank?.address_line1} <br />
                                                {'  '}{documentData.intend.bankDetails?.bank?.address_line2} <br />
                                                {'  '}{documentData.intend.bankDetails?.bank?.address_line3}
                                            </p>
                                        </> : <>{''}</>
                                        }
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        {/* Table */}
                        <Grid item xs={12}>
                            <table style={tableStyle}>
                                <thead style={theadStyle}>
                                    <tr style={trStyle}>
                                        <th
                                            style={{
                                                width: '10%',
                                                textAlign: 'center',
                                                ...thStyle
                                            }}
                                        >
                                            SR No
                                        </th>
                                        <th
                                            style={{
                                                width: '40%',
                                                textAlign: 'center',
                                                ...thStyle
                                            }}
                                        >
                                            Description of Item
                                        </th>
                                        <th
                                            style={{
                                                width: '10%',
                                                textAlign: 'center',
                                                ...thStyle
                                            }}
                                        >
                                            Qty. in Packs
                                        </th>
                                        <th
                                            style={{
                                                width: '10%',
                                                textAlign: 'center',
                                                ...thStyle
                                            }}
                                        >
                                            Order Qty
                                        </th>
                                        <th
                                            style={{
                                                width: '10%',
                                                textAlign: 'center',
                                                ...thStyle
                                            }}
                                        >
                                            Unit Price ({documentData?.intend?.quotedUnitPrice}){' '}{documentData?.intend?.currency?.cc}
                                        </th>
                                        <th
                                            style={{
                                                width: '20%',
                                                textAlign: 'center',
                                                ...thStyle
                                            }}
                                        >
                                            Total {documentData?.intend?.currency?.cc}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documentData.ItemsDetails && documentData.ItemsDetails.map((item, i) => {
                                        return <tr key={i} style={trStyle}>
                                            <td style={tdStyle}>
                                                <p style={f1_css_center}>{item?.rowData?.ItemSnap?.sr_no}</p>
                                                {Category !== "Pharmaceutical" &&
                                                    <p style={f1_css_center}>{i + 1}</p>
                                                }
                                            </td>
                                            <td style={tdStyle}>
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
                                                            <b>Medium Description</b><br />
                                                            {item?.rowData?.ItemSnap?.medium_description}
                                                        </p>
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
                                                    </> :
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

                                                {/* shelf life */}
                                                {
                                                    item.itemData.type === 'Warranty' ?
                                                        item.itemData.shelfLife && (<>
                                                            <span style={f1_b_css}>Warranty:</span>
                                                            <span style={f1_css}>{item.itemData.shelfLife}</span>
                                                        </>)
                                                        :
                                                        item.itemData.shelfLife && (<>
                                                            <span style={f1_b_css}>Shelf Life:</span>
                                                            <span style={f1_css}>{item.itemData.shelfLife}</span>
                                                        </>)
                                                }

                                                {/* Manufacturer */}
                                                {item.itemData.manufacture && <p style={f1_b_css}>Manufacturer:</p>}
                                                {item.itemData.manufacture && <p style={f1_css}>{item.itemData.manufacture?.name} - {item.itemData?.countryOfOrigin?.description} </p>}

                                                {/* Delivery Schedule */}
                                                {item.itemData.deliverySchedule && item.itemData.deliverySchedule.length > 0 && <p style={f1_b_css}>Delivery Schedule:</p>}
                                                {item.itemData.deliverySchedule && item.itemData.deliverySchedule.map((data, i) => {
                                                    return (
                                                        <p key={i} style={f1_css}>{`${convertTocommaSeparated(data?.quantity, 0)} NOS, ${data?.sheduleDate && ", Date: " + dateParse(data?.sheduleDate)} ${data?.remark && ", Remark : " + data?.remark} ${data?.deliveryLocation && ", Location: " + data?.deliveryLocation}`}</p>

                                                    )
                                                })}

                                            </td>
                                            <td style={tdStyle}>
                                                {/* <p style={f1_css_center}>{item?.itemData?.quantityInPacks}</p> */}
                                                <p style={f1_css_center}>{convertTocommaSeparated(item?.itemData?.orderQuantity / item?.itemData?.unit, 2)}</p>
                                                <p style={f1_css_center}> {item?.itemData?.packingDetails.map(item => item?.UOM).join(' X ')}</p>
                                                <p style={f1_css_center}> {item?.itemData?.packingDetails.map(item => item?.packSize).join(' X ')}</p>
                                            </td>
                                            <td style={tdStyle}>
                                                <p style={f1_css_center}>{convertTocommaSeparated(item?.itemData?.orderQuantity, 0)}</p>
                                                <p style={f1_css_center}>{item?.itemData?.unitType}</p>
                                            </td>
                                            <td style={tdStyle}>
                                                <p>{`${convertTocommaSeparated(item?.itemData?.price, 2)} Per ${item?.itemData?.unit} of ${item?.itemData?.unitType}`}</p>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right', }}>
                                                <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.subTotal, 2)}`}</p>
                                                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "left", flex: 1 }}>{`Discount (${item?.itemData?.discount ? roundDecimal(item?.itemData?.discount, 2) : 0})% : `}
                                                    </span>
                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${isNaN(parseFloat(item?.itemData?.discount)) ? 0 : convertTocommaSeparated((parseFloat(item?.itemData?.discount) * item?.itemData.subTotal) / 100, 2)} `}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "left", flex: 1 }}>{`Tax (${item?.itemData?.taxPercentage ? roundDecimal(item?.itemData?.taxPercentage, 2) : 0})% : `}
                                                    </span>
                                                    <span style={{ margin: 0, fontSize: '12px', textAlign: "right" }}>{`${convertTocommaSeparated(item?.itemData?.taxAmount, 2)}`}
                                                    </span>
                                                </div>
                                                {/* {item?.itemData?.taxAmount && <p style={{ ...f1_css_center, marginTop: "0.5rem" }}>{`Tax ( ${item?.itemData?.taxPercentage})%: ${convertTocommaSeparated(item?.itemData?.taxAmount, 2)} `}</p>}
                                                <p style={f1_css}>{`${convertTocommaSeparated(item?.itemData?.total, 2)}`}</p> */}
                                                {/* <p>{`${documentData.intend.currency?.name} ${convertTocommaSeparated(item.itemData.price, 2)}`}</p> */}
                                            </td>
                                        </tr>
                                    })}

                                    <tr className='items-tr'>
                                        <td style={tdStyle} colSpan="2"></td>
                                        <td
                                            colSpan="3"
                                            style={{
                                                ...tdStyle,
                                                borderLeft: ' none ',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Sub total ({documentData?.intend?.quotedUnitPrice})
                                        </td>
                                        <td
                                            style={{
                                                ...tdStyle,
                                                textAlign: 'right',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {convertTocommaSeparated(documentData?.OthersGeneral?.pureSubTotal, 2)}
                                        </td>
                                    </tr>

                                    <tr className='items-tr'>
                                        <td
                                            colSpan="2"
                                            style={{
                                                ...tdStyle,
                                                borderTop: 'none',
                                            }}
                                        ></td>
                                        <td
                                            colSpan="3"
                                            style={{
                                                ...tdStyle,
                                                borderLeft: 'none',
                                                borderTop: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Tax
                                        </td>
                                        <td
                                            style={{
                                                ...tdStyle,
                                                textAlign: 'right',
                                            }}
                                        >
                                            {/* Updated */}
                                            {/* {convertTocommaSeparated(tax?.value, 2)} */}
                                            {convertTocommaSeparated(taxAmount, 2)}
                                        </td>
                                    </tr>
                                    <tr className='items-tr'>
                                        <td
                                            colSpan="2"
                                            style={{
                                                ...tdStyle,
                                                borderTop: 'none',
                                            }}
                                        ></td>
                                        <td
                                            colSpan="3"
                                            style={{
                                                ...tdStyle,
                                                borderLeft: 'none',
                                                borderTop: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Discount
                                        </td>
                                        <td
                                            style={{
                                                ...tdStyle,
                                                textAlign: 'right',
                                                borderTop: 'none'
                                            }}
                                        >
                                            {/* Updated */}
                                            {/* {convertTocommaSeparated(discount?.value, 2)} */}
                                            {isNaN(discountAmount) ? 0 : convertTocommaSeparated(discountAmount, 2)}
                                        </td>
                                    </tr>
                                    {documentData.intend?.POType === 'F' &&
                                        <tr className='items-tr'>
                                            <td
                                                colSpan="2"
                                                style={{
                                                    ...tdStyle,
                                                    borderTop: 'none',
                                                }}
                                            ></td>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    ...tdStyle,
                                                    borderLeft: 'none',
                                                    borderTop: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Grand Total (C&F)      {/*{documentData?.intend?.quotedUnitPrice}*/}
                                            </td>
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {convertTocommaSeparated(documentData?.OthersGeneral?.subTotal, 2)}
                                            </td>
                                        </tr>
                                    }
                                    {documentData.intend?.POType === 'F' &&
                                        <tr className='items-tr'>
                                            <td
                                                colSpan="2"
                                                style={{
                                                    ...tdStyle,
                                                    borderTop: 'none',
                                                }}
                                            ></td>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    ...tdStyle,
                                                    borderLeft: 'none',
                                                    borderTop: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Freight Charges
                                            </td>
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign: 'right',
                                                    borderTop: 'none',
                                                }}
                                            >
                                                {convertTocommaSeparated(documentData?.OthersGeneral?.freightChargers, 2)}
                                            </td>
                                        </tr>
                                    }
                                    {documentData.intend?.POType === 'F' &&
                                        <tr className='items-tr'>
                                            <td
                                                colSpan="2"
                                                style={{
                                                    ...tdStyle,
                                                    borderTop: 'none',
                                                }}
                                            ></td>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    ...tdStyle,
                                                    borderLeft: 'none',
                                                    borderTop: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Handling/Packing Charges
                                            </td>
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign: 'right',
                                                    borderTop: 'none',
                                                }}
                                            >
                                                {convertTocommaSeparated(documentData?.OthersGeneral?.handlAndPackagingCharge, 2)}
                                            </td>
                                        </tr>
                                    }
                                    <tr className='items-tr'>
                                        <td
                                            colSpan="2"
                                            style={{
                                                ...tdStyle,
                                                borderTop: 'none',
                                            }}
                                        ></td>
                                        <td
                                            colSpan="3"
                                            style={{
                                                ...tdStyle,
                                                borderLeft: 'none',
                                                borderTop: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Other Charges
                                        </td>
                                        <td
                                            style={{
                                                ...tdStyle,
                                                textAlign: 'right',
                                                borderTop: 'none',
                                            }}
                                        >
                                            {convertTocommaSeparated(documentData?.OthersGeneral?.otherCharge, 2)}
                                        </td>
                                    </tr>
                                    {documentData.intend?.POType === 'F' &&
                                        <tr className='items-tr'>
                                            <td
                                                colSpan="2"
                                                style={{
                                                    ...tdStyle,
                                                    borderTop: 'none',
                                                }}
                                            ></td>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    ...tdStyle,
                                                    borderLeft: 'none',
                                                    borderTop: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Final Total ({documentData?.intend?.quotedUnitPrice})
                                            </td>
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {convertTocommaSeparated(total, 2)}
                                            </td>
                                        </tr>
                                    }
                                    {
                                        documentData.intend?.POType === 'F' &&
                                        <tr className='items-tr'>
                                            <td
                                                colSpan="2"
                                                style={{
                                                    ...tdStyle,
                                                    borderTop: 'none',
                                                }}
                                            ></td>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    ...tdStyle,
                                                    borderLeft: 'none',
                                                    borderTop: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Commission {documentData?.OthersGeneral?.commission?.percentage} %
                                            </td>
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign: 'right',
                                                    borderTop: 'none'
                                                }}
                                            >
                                                {convertTocommaSeparated(documentData?.OthersGeneral?.commission?.value, 2)}
                                            </td>
                                        </tr>
                                    }
                                    <tr className='items-tr'>
                                        <td
                                            colSpan="2"
                                            style={{
                                                ...tdStyle,
                                                borderTop: 'none',
                                            }}
                                        ></td>
                                        <td
                                            colSpan="3"
                                            style={{
                                                ...tdStyle,
                                                borderLeft: 'none',
                                                borderTop: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Total Payable to
                                            Supplier
                                        </td>
                                        <td
                                            style={{
                                                ...tdStyle,
                                                textAlign: 'right',
                                            }}
                                        >
                                            {convertTocommaSeparated(documentData?.OthersGeneral?.grandTotal, 2)}
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
                                <p style={f1_css}>{documentData?.intend?.exchangeRate ? roundDecimal(documentData?.intend?.exchangeRate, 4) : ""}</p>
                            </Grid>
                            <Grid item xs={1}>
                                <p style={f1_b_css}>as at</p>
                            </Grid>
                            <Grid item xs={2}>
                                <p style={f1_css}>
                                    {documentData?.intend?.currencyDate ? roundDecimal(documentData?.intend?.currencyDate, 4) : ''}
                                </p>
                            </Grid>
                            <Grid item xs={3}>
                                <p style={f1_b_css}>= LKR {convertPrice(roundDecimal(documentData?.intend?.exchangeRate, 4), total)} </p>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container>
                            <Grid item xs={4}>
                                <p style={f1_b_css}>Total Value in Foreign Currency</p>
                            </Grid>
                            <Grid item xs={2}>
                                <p style={f1_b_css}>{documentData?.intend?.currency?.name}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p style={f1_b_css}>{numberToName(total)}</p>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ margin: '5px 0' }}>
                            <Divider />
                            <p>SPECIAL CONDITIONS</p>
                            <RenderedContent HTML={documentData?.noteAndAttachment?.note} />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <p>MSD CONDITIONS</p>
                            <RenderedContent HTML={documentData?.conditions} />
                            <Divider />
                        </Grid>

                        {documentData?.intend?.POType === 'F' ? (
                            <Grid item xs={12} >
                                <Divider />
                                <p>Shipping Conditions</p>
                                <RenderedContent HTML={documentData?.shipping_conditions?.condition} />
                            </Grid>
                        ) :
                            <>
                                {Category !== "Pharmaceutical" &&
                                    <Grid item xs={12}>
                                        <Divider />
                                        <RenderedContent HTML={documentData?.shipping_conditions?.condition} />
                                    </Grid>
                                }
                            </>
                        }
                        {/* TODO: uncomment this when conditions come from MSD */}
                        {/* <Grid item xs={12}>
                            {MSDConditionsList && MSDConditionsList.map((rs, i) => {
                                return <p key={i}>{rs.description}</p>
                            })}subTotal
                        </Grid> */}
                        {documentData.intend.localAgent && documentData.intend?.POType === 'F' && (
                            <Grid item xs={12} style={{ marginTop: "10px" }}>
                                <p style={f1_b_css}>Local Agent Details</p>
                                <p style={f1_css}>Name: &nbsp;{documentData.intend.localAgent?.name} </p>
                                <p style={f1_css}>Company: &nbsp;{documentData.intend.localAgent?.company} </p>
                                <p style={f1_css}>Contact No: &nbsp;{documentData.intend.localAgent?.contact_no} </p>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </div>
        )

    } else {
        return <p style={{ textAlign: 'center' }}>Data isn't available</p>
    }
}