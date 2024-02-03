import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Checkbox,
    Badge,
    IconButton,
    Icon,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import FinanceServices from 'app/services/FinanceServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { roundDecimal, scrollToTop } from 'utils'
import localStorageService from 'app/services/localStorageService'

import VisibilityIcon from '@material-ui/icons/Visibility'
import FinanceDocumentServices from 'app/services/FinanceDocumentServices'

const styleSheet = (theme) => ({})

class CreatedSalesReports extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            selectedItems: [],

            columns: [
                
                {
                    name: 'payment_no',
                    label: 'No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.payment_no
                        }
                    },
                },

                {
                    name: 'total_amount',
                    label: 'Total Amount',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.total_amount
                        }
                    },
                },
                // {
                //     name: 'wharf_ref_no',
                //     label: 'WHARF Ref No',
                //     options: {
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             return data[dataIndex]?.data.warf_ref_no ? data[dataIndex]?.data.warf_ref_no : "Not Available"
                //         }
                //     },
                // },
                {
                    name: 'name',
                    label: 'Payee',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.payees?.name
                        }
                    },
                },
                {
                    name: 'name',
                    label: 'Payer',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.payers?.name
                        }
                    },
                },
                
            ],

            alert: false,
            message: '',
            severity: 'success',
            allPayees: [],

            loaded: false,
            total: null,
            filterData: {
                limit: 20,
                page: 0
            },
            formData: {
                total_amount: 0,
                payee: null,
                payer: null,
                created_by: null,
                remark: null,
            }
        }
    }

    async loadData() {
      this.setState({ loaded: false })
  

        let res = await FinanceDocumentServices.getCreatedRecepts(this.state.filterData)
        if (res.status == 200) {
            console.log('res', res.data.view.data)
            this.setState({
                data: res.data.view.data,
                total: res.data.view.totalItems,
                loaded: true
            })
        }


    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                console.log('New filterData', this.state.filterData)
                this.loadData()
            }
        )
    }


 

    componentDidMount() {
        this.loadData()
    }


    async submitData() {
        let formData = this.state.formData;
        formData.document_ids = this.state.selectedItems
        formData.payee = this.state.data[0].payee_id
        formData.payee = this.state.data[0].payee_id

        let res = await FinanceDocumentServices.receptPaymentCreate(formData)
        if (res.status === 201) {
            this.setState({ 

                alert: true,
                message: 'Payment Recept Created',
                severity: 'success',

             })
             setTimeout(() => {
                window.location.reload()
             }, 1000);
        }

    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Created Sales Report" />

                        

                        {/* Table Section */}
                        <Grid container className="mt-3 pb-5">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                {this.state.loaded ?
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            count: this.state.total,
                                            rowsPerPage: this.state.filterData.limit,
                                            page: this.state.filterData.page,
                                            download: false,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(
                                                    action,
                                                    tableState
                                                )
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                    : null}
                            </Grid>
                        </Grid>

                      


                    </LoonsCard>
                </MainContainer>

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CreatedSalesReports)
