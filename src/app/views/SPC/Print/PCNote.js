import React, { Fragment, Component } from 'react'
import { Button, Grid, Box } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any } from 'prop-types'
import InventoryService from 'app/services/InventoryService'
import SchedulesServices from 'app/services/SchedulesServices'
import { dateParse, timeParse, roundDecimal } from 'utils'
import { intlFormat } from 'date-fns'
import PrintIcon from '@mui/icons-material/Print'

const fontStyle1 = {
    margin: 0,
}
const fontStyle2 = {
    margin: 0,
    fontWeight: 500,
}

class PCNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            orderList: [],
            orderId: null,
            orderListId: null,
            userName: null,
            myData: [],
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
        const {
            date,
            orderListNo,
            itemSRNo,
            estTotalCost,
            orderListDate,
            itemsForYear,
            supplyDate,
        } = this.props.formData
        /*  size: 297mm 420mm, */
        const pageStyle = `

        
 
 @page {
    
    margin-left:20mm,
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
                            Create PC Note
                        </Button>
                    )}
                    pageStyle={pageStyle}
                    content={() => this.componentRef}
                />

                <Grid className="bg-light-gray p-5 hidden">
                    <div className="bg-white p-5">
                        <div>
                            <div ref={(el) => (this.componentRef = el)}>
                                <Grid
                                    container
                                    style={{
                                        paddingTop: '4rem',
                                        paddingLeft: '1rem',
                                    }}
                                >
                                    <Grid item xs={12}>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            Note
                                        </p>
                                    </Grid>
                                    <Grid item xs={12} container>
                                        <Grid item xs={1}>
                                            <p style={fontStyle1}>TO</p>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <p style={fontStyle1}>
                                                :PROCUMEMENT COMMITEE
                                            </p>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <p style={fontStyle1}>DATE</p>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <p style={fontStyle1}>:{date}</p>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <hr
                                            style={{
                                                borderTop: '1px dashed black',
                                            }}
                                        ></hr>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        <Grid item xs={2}>
                                            <p style={fontStyle2}>
                                                Order List No
                                            </p>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <p style={fontStyle2}>
                                                : {orderListNo}
                                            </p>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <p style={fontStyle2}>Item/SR NO</p>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <p style={fontStyle2}>
                                                : {itemSRNo}
                                            </p>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <p style={fontStyle2}>
                                                Estimate total Cost = LKR{' '}
                                                {estTotalCost}
                                            </p>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <hr
                                            style={{
                                                borderTop: '1px dashed black',
                                            }}
                                        ></hr>
                                        <hr
                                            style={{
                                                borderTop: '1px dashed black',
                                            }}
                                        ></hr>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <p style={fontStyle1}>
                                            Reference above the order list dated{' '}
                                            {orderListDate} received from the
                                            Director Medical Suppliers Division
                                            for supplye of items for year{' '}
                                            {itemsForYear}.(f-1-15)
                                        </p>
                                        <p>
                                            Delivery schedule is indcated to
                                            supply in {supplyDate}
                                        </p>
                                        <p>
                                            Therefore, file is submitted to
                                            Procurement Commitee for a decision
                                            please.
                                        </p>
                                    </Grid>

                                    <Grid
                                        item
                                        container
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Grid item xs={3}>
                                            <p
                                                style={{
                                                    ...fontStyle2,
                                                    paddingTop: '2rem',
                                                }}
                                            >
                                                Manager Imports
                                            </p>
                                            <p style={fontStyle2}>
                                                (Surgical & Lab)
                                            </p>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <p
                                                style={{
                                                    ...fontStyle2,
                                                    paddingTop: '2rem',
                                                }}
                                            >
                                                Procurement Officer
                                            </p>
                                            <p style={fontStyle2}>
                                                (Surgical Annual Unit)
                                            </p>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <p>
                                            CC: Assitant Manager Procuring Uint
                                        </p>
                                        <p>KP:03.01.2023</p>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                </Grid>
            </div>
        )
    }
}

export default PCNote
