/*
Loons Lab - VPA Admission Component
*/
import React, { Fragment, useState, Component } from 'react'
import { Divider, Typography, Grid } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any, string } from 'prop-types'
import defaultHeader from '../AdmissionCard/admissionCard_header.png'
import defaultFooter from '../PrintLetters/defaultFooter.jpg'
import { Button } from 'app/components/LoonsLabComponents'
import SubTitle from '../SubTitle'

class AdmissionCard extends Component {
    static propTypes = {
        header: any,
        footer: any,
        referenceSection: any,
        year: any,

        //applicant data
        name: any,
        indexNo: any,
        nic: any,

        signature: any,
        timeTable: any,
    }

    static defaultProps = {
        header: defaultHeader,
        // footer: defaultFooter,
        referenceSection: true,
        year: null,

        //applicant data
        name: null,
        indexNo: null,
        nic: null,

        signature: null,
        letterTitle: 'Admission Card',

        timeTable: [],
    }

    newlineText(text) {
        return text.split('\n').map((str) => <p>{str}</p>)
    }

    render() {
        const {
            header,
            letterTitle,
            footer,
            referenceSection,
            year,

            //applicant data
            name,
            indexNo,
            nic,

            signature,
            timeTable,
        } = this.props
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
        `

        return (
            <div>
                <Grid className="w-full justify-start items-start flex mt-2 mb-2">
                    <SubTitle title="Admission Card" />
                </Grid>
                <Grid
                    className="bg-light-gray p-5 "
                    style={{
                        borderStyle: 'double',
                        borderColor: '#a5a4a4',
                        height: '350px',
                        overflow: 'auto',
                    }}
                >
                    <div className="bg-white p-5">
                        <div>
                            <div ref={(el) => (this.componentRef = el)}>
                                {/* header */}
                                <div className="header-space">
                                    <img
                                        alt="A header image"
                                        src={header}
                                        style={{ width: '100%' }}
                                    />
                                    <div
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                            fontSize: 20,
                                            marginTop: -40,
                                            marginLeft: 25,
                                            fontFamily: 'Serif',
                                        }}
                                    >
                                        <b>
                                            යෝග්‍යතා පරීක්ෂණය(මාර්ගගත) - {year}
                                        </b>
                                        <br />
                                        <b>Aptitude Test(Online) - {year}</b>
                                    </div>
                                    <hr
                                        style={{
                                            border: '1px solid black',
                                            padding: '1px',
                                        }}
                                    />
                                </div>

                                {/* sub header */}
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: 25,
                                        marginLeft: 25,
                                        fontWeight: 'bold',
                                        fontFamily: 'Serif',
                                    }}
                                >
                                    <u>විභාග ප්‍රවේශ පත්‍රය</u>
                                    <br />
                                    <u>ADMISSION CARD</u>
                                </div>

                                {/* Body */}

                                {/* section 1 */}
                                <Grid container spacing={2} className="mt-10">
                                    {/* Name */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                අයදුම්කරුගේ සම්පුර්ණ නම : <br />
                                                Name of the Applicant
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                &emsp; {name} &emsp;
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* Index Number */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                විභාග අංකය : <br />
                                                Index No
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                &emsp; {indexNo} &emsp;
                                            </div>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                ජාතික හැදුනුම්පත් අංකය : <br />
                                                NIC No
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                &emsp; {nic} &emsp;
                                            </div>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Grid
                                            container
                                            justify="flex-end"
                                            // alignItems="center"
                                            // justify="center"
                                            // direction="row"
                                        >
                                            {/* NIC */}
                                            {/* <Grid
                                                item
                                                xs={6}
                                                sm={6}
                                                md={6}
                                                lg={6}
                                            >
                                                <div className="flex">
                                                    <div
                                                        style={{
                                                            fontSize: 15,
                                                            fontFamily: 'Serif',
                                                        }}
                                                    >
                                                        ජාතික හැදුනුම්පත් අංකය :{' '}
                                                        <br />
                                                        NIC No
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 15,
                                                            marginLeft: 5,
                                                            textDecorationLine:
                                                                'underline',
                                                            textDecorationStyle:
                                                                'dotted',
                                                        }}
                                                    >
                                                        &emsp; {nic} &emsp;
                                                    </div>
                                                </div>
                                            </Grid> */}

                                            {/* Signature */}
                                            <Grid
                                                item
                                                xs={6}
                                                sm={6}
                                                md={6}
                                                lg={6}
                                            >
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize: 15,
                                                            textAlign: 'center',
                                                            textDecorationLine:
                                                                'underline',
                                                            textDecorationStyle:
                                                                'dotted',
                                                        }}
                                                    >
                                                        <img
                                                            src={signature}
                                                            width="100px"
                                                            height="50px"
                                                        />
                                                        <div
                                                            style={{
                                                                fontSize: 15,
                                                                textDecorationLine:
                                                                    'underline',
                                                                textDecorationStyle:
                                                                    'dotted',
                                                            }}
                                                        >
                                                            &emsp; &emsp;
                                                            &emsp;&emsp; &emsp;
                                                            &emsp; &emsp; &emsp;
                                                            &emsp;&emsp; &emsp;
                                                        </div>
                                                        {/* <hr
                                                            style={{
                                                                border: '1px dotted black',
                                                                width: '100%',
                                                            }}
                                                        /> */}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 15,
                                                            fontFamily: 'Serif',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        සහකාර ලේඛකාධිකාරී /
                                                        විභාග
                                                        <br />
                                                        Assistant Registrar/
                                                        Examination
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <hr
                                    className="mt-5"
                                    style={{
                                        border: '1px solid black',
                                    }}
                                />

                                {/* section 2 - time table */}
                                <Grid container className="mt-5">
                                    <table
                                        border="1px solid black"
                                        style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                <th>විෂය/Subject</th>
                                                <th>දිනය/Date</th>
                                            </tr>

                                            {timeTable.length > 0 ? (
                                                <>
                                                    {timeTable.map((mode, key) => (
                                                        <tr key={key}>
                                                            <td className="p-4">
                                                                {mode.mode}
                                                            </td>
                                                            <td className="p-4">
                                                                Start Date :{' '}
                                                                {mode.submission_startDate !=
                                                                null
                                                                    ? mode.submission_startDate
                                                                    : 'Will be notified shortly...'}
                                                                <br />
                                                                End Date :{' '}
                                                                {mode.submission_endDate !=
                                                                null
                                                                    ? mode.submission_endDate
                                                                    : 'Will be notified shortly...'}
                                                                <br />
                                                                Link :{' '}
                                                                {mode.link !=
                                                                null
                                                                    ? mode.link
                                                                    : 'Will be notified shortly...'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <tr>
                                                        <td className="p-4">
                                                            Uploading of
                                                            portfolio
                                                        </td>
                                                        <td className="p-4">
                                                            Please upload to the
                                                            link attach
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4">
                                                            Viva
                                                        </td>
                                                        <td className="p-4">
                                                            (Zoom Link, Date and
                                                            time will be
                                                            notified in future)
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </Grid>

                                {/* sub header 2 - sign*/}
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: 15,
                                        // marginLeft: 25,
                                        marginTop: 300,
                                        fontWeight: 'bold',
                                        fontFamily: 'Serif',
                                    }}
                                >
                                    අත්සන් සහතික කිරීම / ATTESTATION
                                    <hr
                                        style={{
                                            border: '1px solid black',
                                        }}
                                    />
                                </div>

                                {/* section 3 */}
                                <Grid container spacing={2} className="mt-10">
                                    {/* Date */}
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                දිනය : <br />
                                                Date
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                &emsp; &emsp; &emsp; &emsp;
                                                &emsp; &emsp; &emsp;
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* applicant sign */}
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="mt-2">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textAlign: 'center',
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                </div>
                                            </div>
                                            <div
                                                // align="right"
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                අයදුම්කරුගේ අත්සන (Signature of
                                                the applicant)
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* note 1 */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className="mt-5"
                                    >
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontFamily: 'Serif',
                                            }}
                                        >
                                            ඉහත නම් සඳහන් අයදුම්කරු මා හොදින්
                                            දන්නා හදුනන බවත්, අද දින මා
                                            ඉදිරිපිටදී මෙහි අත්සන් තැබූ බවත්
                                            මෙයින් සහතික කරමි. <br />I hereby
                                            certify that the above applicant is
                                            known to me and he placed his/ her
                                            signature before me on
                                            ................ at
                                            ................................................................
                                        </div>
                                    </Grid>

                                    {/* Date */}
                                    <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        className="mt-5"
                                    >
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                දිනය : <br />
                                                Date
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                &emsp; &emsp; &emsp; &emsp;
                                                &emsp; &emsp; &emsp;
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* sign */}
                                    <Grid
                                        item
                                        className="mt-5"
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                    >
                                        <div className="mt-2">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textAlign: 'center',
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                </div>
                                            </div>
                                            <div
                                                // align="right"
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                *සහතික කරන්නාගේ අත්සන <br />
                                                (Signature of the person who
                                                certify))
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* Name of the  person who certify */}
                                    <Grid
                                        item
                                        className="mt-5"
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                අත්සන සහතික කරන්නාගේ නම : <br />
                                                Name of the person who certify
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* Designation */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                තනතුර : <br />
                                                Designation
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* Address */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                ලිපිනය : <br />
                                                Address
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp;
                                                    &emsp;&emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp;&emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp;&emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp;&emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp;
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* official Stamp */}
                                    <Grid
                                        item
                                        className="mt-5"
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <div className="flex">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                නිල මුද්‍රාව : <br />
                                                Official Stamp
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                {/* <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp;
                                                </div> */}
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* Note 2 */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontFamily: 'Serif',
                                            }}
                                        >
                                            * අයදුම්කරුගේ අත්සන සහතික කළයුත්තේ
                                            විහාරාධිපතිවහන්සේ කෙනෙකු,
                                            විදුහල්පතිවරයෙකු හෝ සාමදාන
                                            විනිශ්චයකාරවරයෙකු විසිනි.
                                            (Applicants identity should be
                                            attested by a Buddhist Monk, a
                                            incumbent of a place of worship of
                                            any other religion, a principal of a
                                            school or justice of peace)
                                        </div>
                                    </Grid>
                                </Grid>

                                {/* sub header 3 - DECLARATION*/}
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: 15,
                                        // marginLeft: 25,
                                        marginTop: 20,
                                        fontWeight: 'bold',
                                        fontFamily: 'Serif',
                                    }}
                                >
                                    අයදුම්කරුගේ ප්‍රකාශය / DECLARATION
                                    <hr
                                        style={{
                                            border: '1px solid black',
                                        }}
                                    />
                                </div>

                                {/* section 4 */}
                                <Grid container spacing={2} className="mt-10">
                                    {/* note 3 */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontFamily: 'Serif',
                                            }}
                                        >
                                            මා විසින් ඉහතින් දක්වා ඇති තොරතුරු
                                            හා නිර්මාණ මගේම නිර්මාණ බව තහවුරු
                                            කරන අතරම මා විසින් සාවද්‍ය නිර්මාණ
                                            හෝ ඉදිරිපත් කළහොත් යෝග්‍යතා
                                            පරික්ෂණයෙදී මා නුසුදුස්සෙකු ලෙස
                                            සැළකීමට හේතුවන බව මා දන්නා බව සදහන්
                                            කරමි.
                                            <br />I hereby certify that the
                                            above mentioned information
                                            furnished by me is true and correct
                                            and creations are my own creation.
                                            If it is found to be that the
                                            information and creations provided
                                            above are incorrect and found to be
                                            not owned by me, I know well that I
                                            will be an ineligible candidate for
                                            the aptitude test.
                                        </div>
                                    </Grid>

                                    {/* Date */}
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="flex mt-10">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                }}
                                            >
                                                දිනය : <br />
                                                Date
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                &emsp; &emsp; &emsp; &emsp;
                                                &emsp; &emsp; &emsp;
                                            </div>
                                        </div>
                                    </Grid>

                                    {/* applicant sign */}
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="mt-10">
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                    textAlign: 'center',
                                                    textDecorationLine:
                                                        'underline',
                                                    textDecorationStyle:
                                                        'dotted',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        marginLeft: 5,
                                                        textDecorationLine:
                                                            'underline',
                                                        textDecorationStyle:
                                                            'dotted',
                                                    }}
                                                >
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                    &emsp; &emsp; &emsp; &emsp;
                                                </div>
                                            </div>
                                            <div
                                                // align="right"
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'Serif',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                අයදුම්කරුගේ අත්සන (Signature of
                                                the applicant)
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>

                                <div className="footer">
                                    {/* <img className="footer " alt="A test image" src={footer} style={{ width: '100%' }} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className="w-full justify-end items-end flex mt-2 mb-5">
                    <ReactToPrint
                        trigger={() => (
                            <Button size="small" startIcon="download">
                                Download Admission
                            </Button>
                        )}
                        pageStyle={pageStyle}
                        documentTitle={letterTitle}
                        content={() => this.componentRef}
                    />
                </Grid>
            </div>
        )
    }
}

export default AdmissionCard
