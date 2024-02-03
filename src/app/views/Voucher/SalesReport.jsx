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

class SalesReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            selectedItems: [],

            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid>
                                    <FormControlLabel
                                        //label={field.placeholder}
                                        //name={field.}
                                        //value={val.value}
                                        checked={this.state.selectedItems.includes(this.state.data[dataIndex].id)}
                                        onChange={(event) => {
                                            let data = this.state.data[dataIndex];
                                            let selectedItems = this.state.selectedItems;
                                            let formData = this.state.formData;

                                            if (selectedItems.includes(data.id)) {
                                                let index = selectedItems.indexOf(data.id)
                                                formData.total_amount = formData.total_amount - Number(data.final_value)

                                                selectedItems.splice(index, 1)
                                                this.setState({ selectedItems, formData })
                                            } else {
                                                formData.total_amount = formData.total_amount + Number(data.final_value)

                                                selectedItems.push(data.id)
                                                this.setState({ selectedItems, formData })
                                            }
                                            console.log("selected data", this.state.formData)

                                        }}
                                        control={
                                            <Checkbox
                                                color="primary"
                                                defaultChecked={this.state.selectedItems.includes(this.state.data[dataIndex].id)}
                                                size="small"
                                            />
                                        }
                                        display="inline"

                                    />


                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'recept_no',
                    label: 'No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.data.recept_no ? this.state.data[dataIndex]?.data.recept_no : "NAN"
                        }
                    },
                },

                {
                    name: 'order_no',
                    label: 'Order No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.data?.order_no ? this.state.data[dataIndex]?.data?.order_no : "Not Available"
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
                    label: 'Payer',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.Payer?.name ? this.state.data[dataIndex]?.Payee?.name : "Not Available"
                        }
                    },
                },
                // {
                //     name: 'po_indent_no',
                //     label: 'PO/Indent No',
                //     options: {
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             return data[dataIndex]?.data.indent_no ? data[dataIndex]?.data.indent_no : "Not Available"
                //         }
                //     },
                // },
                {
                    name: 'final_value',
                    label: 'Total Amount',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return roundDecimal(this.state.data[dataIndex]?.final_value, 2)
                        }
                    },
                },

                /*  {
                     name: 'action',
                     label: 'Action',
                     options: {
                         display: true,
                         customBodyRenderLite: (dataIndex) => {
                             return (
                                 <div>
                                     <IconButton onClick={() => {
 
                                     }}>
                                         <VisibilityIcon sx={{ color: '#000' }} />
                                     </IconButton>
                                 </div>
                             )
                         },
                     },
                 }, */
            ],

            alert: false,
            message: '',
            severity: 'success',
            allPayees: [],

            loaded: false,
            total: null,
            filterData: {
                reference_type: ['Sales Order'],
                is_active: true,
                'order[0]': ['createdAt', 'DESC'],
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
        //function for load initial data from backend or other resources
        this.setState({ loaded: false })
        let user_info = await localStorageService.getItem('userInfo')
        let formData = this.state.formData
        formData.created_by = user_info.id


        let res = await FinanceServices.getFinanceDocuments(this.state.filterData)
        if (res.status == 200) {
            console.log('res', res.data.view.data)
            this.setState({
                data: res.data.view.data,
                total: res.data.view.totalItems,
                formData,
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


    async loadPayees(search) {
        let filter = { search: search }

        let res = await FinanceDocumentServices.getPayees(filter)
        if (res.status === 200) {
            this.setState({ allPayees: res.data.view.data })
        }

    }

    componentDidMount() {
        //this.loadData()
    }


    async submitData() {
        let formData = this.state.formData;
        formData.document_ids = this.state.selectedItems
        formData.payee_id = this.state.data[0].payee_id
        //formData.payee = this.state.data[0].payee_id

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
                        <CardTitle title="Sales Report" />

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadData()}
                            onError={() => null}
                        >

                            <Grid container spacing={2}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Payee" />


                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            this.state.allPayees
                                        }
                                        onChange={(e, value, r) => {

                                            if (null != value) {
                                                let filterData = this.state.filterData
                                                filterData.payee_id = value.id
                                                this.setState({
                                                    filterData,
                                                })
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.name
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Employee"
                                                fullWidth
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.loadPayees(e.target.value)
                                                    }
                                                }}
                                                value={this.state.filterData.payee_id}
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item>
                                    <Button type="submit" className="mt-6">
                                        Filter
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

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

                        {this.state.selectedItems.length > 0 &&
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.submitData()}
                                onError={() => null}
                            >

                                <Grid spacing={2}>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title={"Total Amount: " + this.state.formData.total_amount}></SubTitle>
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Remark" />


                                        <TextValidator
                                            className="w-full"
                                            placeholder="Remark"
                                            name="remark"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.formData.remark}
                                            type="text"
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                this.setState({
                                                    formData: {
                                                        ...this.state.formData,
                                                        remark: e.target.value,
                                                    },
                                                })
                                            }}
                                        /*  validators={[
                                             'required',
                                         ]}
                                         errorMessages={[
                                             'this field is required',
                                         ]} */
                                        />
                                    </Grid>

                                    <Grid item>
                                        <Button type="submit" className="mt-5">
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        }


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

export default withStyles(styleSheet)(SalesReport)
