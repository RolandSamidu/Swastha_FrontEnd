import React, { Component } from 'react'
import { Button, Grid } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any } from 'prop-types'
import PrintIcon from '@mui/icons-material/Print'

class PO extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            orderList: [],
            orderId: null,
            orderListId: null,
            userName: null,
            myData: [],
            pageNumber: 1,
            header: 'This is the header',
            footer: 'This is the footer',
        }
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

    componentDidMount() {}

    render() {
        // const {
        //     date,
        //     orderListNo,
        //     itemSRNo,
        //     estTotalCost,
        //     orderListDate,
        //     itemsForYear,
        //     supplyDate,
        // } = this.props.formData
        /*  size: 297mm 420mm, */

        const pageStyle = `
          
        div.page-footer {
            font-size: 12px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }
        
        div.page-footer p {
            margin: 0;
        }
        
        table.report-container {
            page-break-after: always;
            width: 100%;
        }
        
        thead.report-header {
            display: table-header-group;
        }
        
        tfoot.report-footer {
            display: table-footer-group;
        }
        
        div.footer-info, div.page-footer {
            display: none;
        }

        
        @page {
           @top-right:{
                content:"Page" counter(page);
           }
        }

        @media print {
            @page {
                size: A4;
                margin: 5mm 15mm 5mm 20mm;
            }
            
        

            div.page-footer, div.footer-info {
                display: block;
            }
        }
`

        // const totalQuantity = item.OrderListItemSchedules.reduce(
        //     (total, element) => total + element.quantity,
        //     0
        //   );

        return (
            <div>
                <ReactToPrint
                    trigger={() => (
                        <Button
                            id="print_button_006"
                            variant="contained"
                            color="primary"
                            style={{ width: '100%' }}
                            startIcon={<PrintIcon />}
                        >
                            Test
                        </Button>
                    )}
                    pageStyle={pageStyle}
                    content={() => this.componentRef}
                />

                <Grid className="bg-light-gray p-5 hidden">
                    <div >
                        <div ref={(el) => (this.componentRef = el)}>
                            <table>
                                <thead className="report-header">
                                    <tr>
                                        <th className="report-header-cell">
                                            <div className="header-info">
                                                INDENT NO:
                                                DHS/S/WW/216/248LM/2021
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tfoot className="report-footer">
                                    <tr>
                                        <td className="report-footer-cell">
                                            <div className="footer-info">
                                                <div className={'page-footer'}>
                                                    PROCUREMENT
                                                    OFFCER(DHS/SURGICAL)
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                                <tbody className="report-content">
                                    <tr>
                                        <td className="report-content-cell">
                                            <div>
                                                {Array.from(
                                                    { length: 20 },
                                                    (_, i) => (
                                                        <p
                                                            key={i}
                                                            className="second-page"
                                                            style={{padding:'4rem 0'}}
                                                        >
                                                            Hello World Hello
                                                            World Hello World
                                                            Hello World Hello
                                                            World Hello World
                                                            Hello World Hello
                                                            World Hello World
                                                            Hello World Hello
                                                            World Hello World
                                                            Hello World Hello
                                                            World Hello World
                                                            Hello World Hello
                                                            World Hello World
                                                            Hello World Hello
                                                            World
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Grid>
            </div>
        )
    }
}

export default PO
