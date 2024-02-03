import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, CircularProgress, IconButton, Tooltip } from '@material-ui/core'
import {
    DatePicker,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DescriptionIcon from '@material-ui/icons/Description'
import CachedIcon from '@material-ui/icons/Cached'
import SearchIcon from '@material-ui/icons/Search'
import PreProcumentService from 'app/services/PreProcumentService'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import TableLable from 'app/components/SpcComponents/TableLable'
import { PageContext } from './PageContext'
import localStorageService from 'app/services/localStorageService'
import { dateParse, convertTocommaSeparated } from 'utils'

class AllOrders extends Component {
    static contextType = PageContext

    constructor(props) {
        super(props)
        this.state = {
            totalItems: 0,
            dataIsLoading: true,
            data: [],
            orderNo: '',
            categoryId: '',
            status: '',
            severity: 'error',
            estimatedValueTo: '0',
            message: '',
            alert: false,
            filterData: {
                limit: 10,
                page: 0,
                category_id: '',
                agent_id: '',
                status: '',
                order_no: '',
            },
            columns: [
                {
                    name: 'order_no',
                    label: 'Order List number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'createdAt',
                    label: 'Received Date',
                    options: {
                        display: true,
                        customBodyRender: (date) => {
                            date = dateParse(date)
                            return date
                        },
                    },
                },
                {
                    name: 'Category',
                    label: 'Category',
                    options: {
                        display: true,
                        filter: true,
                        sort: true,
                        customBodyRender: (category) => category.description,
                    },
                },
                {
                    name: 'no_of_items',
                    label: 'Total Number Of Items',
                    options: {
                        display: true,
                        setCellProps: () => ({
                            style: { textAlign: 'center' },
                        }),
                    },
                },
                {
                    name: 'estimated_value',
                    label: 'Total Estimated Value(LKR)MN',
                    options: {
                        display: true,
                        filter: true,
                        sort: true,
                        setCellProps: () => ({ style: { textAlign: 'right' } }),
                        customBodyRender: (price) => {
                            price = convertTocommaSeparated(price, 2)

                            return price
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        filter: true,
                        sort: true,
                        customBodyRender: (status) => (
                            <TableLable status={status} />
                        ),
                    },
                },
                // {
                //     name: 'document',
                //     label: 'Document',
                //     options: {
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let record = this.state.data[dataIndex]
                //             return (
                //                 <Tooltip title="View Document">
                //                     <IconButton>
                //                         <DescriptionIcon color="primary" />
                //                     </IconButton>
                //                 </Tooltip>
                //             )
                //         },
                //     },
                // },

                {
                    name: 'id',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (id, data) => {
                            return (
                                <Tooltip title="View Orders">
                                    <IconButton
                                        onClick={() => {
                                            this.viewSingleOrderList(id, data)
                                        }}
                                    >
                                        <VisibilityIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            )
                        },
                    },
                },
            ],
            selectedCard: 1,
        }
    }

    setSelectedCard = (cardNumber) => {
        this.setState({ selectedCard: cardNumber })
    }
    // handling all orderlists and single order list page
    viewSingleOrderList = (id, data) => {
        const [pageData, setPageData] = this.context
        let record = this.state.data[data.rowIndex]
        

        setPageData({
            ...pageData,
            slug: id,
            approvalStatus: record.status,
            orderNo: record.order_no,
            drugsType: record.Category.description,
        })
    }

    // handling searching
    handleSearch = () => {
        // TODO: add this - this.state.status
        if (this.state.categoryId || this.state.orderNo) {
            const tempFilterData = this.state.filterData

            tempFilterData.page = 0
            tempFilterData.category_id = this.state.categoryId
            tempFilterData.status = this.state.status
            tempFilterData.order_no = this.state.orderNo

            this.getALLOrderLists(tempFilterData)
        } else {
            this.setState({
                alert: true,
                message:
                    'Oops! It looks like you forgot to fill in a field. Please enter at least one field before proceeding.',
            })
        }
    }

    // reset the table after filter apply
    resetTable = () => {
        const tempFilterData = this.state.filterData

        if (
            tempFilterData.category_id ||
            tempFilterData.status ||
            tempFilterData.order_no
        ) {
            tempFilterData.category_id = ''
            tempFilterData.status = ''
            tempFilterData.order_no = ''

            this.setState({
                filterData: tempFilterData,
                categoryId: '',
                status: '',
                orderNo: '',
            })
            this.getALLOrderLists()
        }
    }

    // handling page data in table
    async setPage(page) {
        const tempAllOrderListsData = this.state.filterData
        // update page number
        tempAllOrderListsData.page = page

        this.setState(
            {
                filterData: tempAllOrderListsData,
            },
            () => {
                this.getALLOrderLists()
            }
        )
    }

    // get all order list - pre procuments part
    async getALLOrderLists(param = this.state.filterData) {
        // const param = this.state.filterData

        this.setState({ dataIsLoading: true })

        const resultAllOrderLists = await PreProcumentService.getAllOrderLists(
            param
        )

        const obj = {
            order_list_id: '',
            approval_type: '',
            approved_by: '',
            remark: 'Remark',
            owner_id: '000',
        }

        // const rs = await PreProcumentService.getApprovalList(obj)
        // console.log("🚀 ~ file: AllOrders.jsx:242 ~ AllOrders ~ getALLOrderLists ~ rs:", rs.data)

        if (resultAllOrderLists.status) {
            // totalItems: no of result
            const { data, totalItems } = resultAllOrderLists.data.view

            this.setState({ dataIsLoading: false })

            this.setState(
                {
                    data,
                    totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
    }

    formatEstimateValue(value) {
        // const numberRegex = /^\d{1,3}(,\d{3})*(\.\d{2})?$/;
        // if (!numberRegex.test(value)) {
        //     return this.setState({ estimatedValueTo: "0.00" });;
        // }

        value = value.replaceAll(',', '')

        let tempValue = value.split('.')

        if (tempValue.length > 1) {
            value = tempValue.join('')
        }

        // const cleanedValue = value.replace(',', '');

        value = value / 100

        const numericValue = parseFloat(value)

        if (Number.isNaN(numericValue)) {
            return false
        }

        const formattedValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

        this.setState({ estimatedValueTo: formattedValue })
    }
    async getUserInfo() {
        // TODO: check as admin and super admin
        const { type } = await localStorageService.getItem('userInfo')
        const [pageData, setPageData] = this.context

        const tempPageData = pageData

        if (type) {
            tempPageData.userType = type
        } else {
            tempPageData.userType = 'admin'
        }

        setPageData({ ...tempPageData })
    }
    // handling onload functions
    componentDidMount() {
        this.getALLOrderLists()
        this.getUserInfo()
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title={'All Order Lists'} />
                    <ValidatorForm
                        onSubmit={() => this.handleSearch()}
                        className="w-full"
                        style={{ padding: '10px' }}
                    >
                        <Grid container spacing={1}>
                            <Grid
                                item
                                lg={2}
                                style={{ alignItems: 'end' }}
                                sm={6}
                                xs={12}
                            >
                                <label>From</label>

                                <DatePicker
                                    className="w-full"
                                    placeholder="From"
                                />
                            </Grid>

                            <Grid
                                item
                                lg={2}
                                md={3}
                                style={{ alignItems: 'end' }}
                                sm={6}
                                xs={12}
                            >
                                <label>To</label>

                                <DatePicker
                                    className="w-full"
                                    placeholder="To"
                                />
                            </Grid>

                            <Grid item lg={2} md={3} sm={6} xs={12}>
                                <label>Est. Value From</label>

                                <TextValidator
                                    className=" w-full"
                                    name="excess"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Est. Value From"
                                    InputProps={{
                                        inputProps: {
                                            style: {
                                                textAlign: 'right',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item lg={2} md={3} sm={6} xs={12}>
                                <label>Est. Value To</label>
                                <TextValidator
                                    className=" w-full"
                                    name="To"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    value={this.state.estimatedValueTo}
                                    onChange={(e) => {
                                        this.formatEstimateValue(e.target.value)
                                    }}
                                    size="small"
                                    placeholder="Est. Value To"
                                    InputProps={{
                                        inputProps: {
                                            style: {
                                                textAlign: 'right',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <label>Order List Number</label>
                                <TextValidator
                                    className="w-full"
                                    name="Order List Number"
                                    InputLabelProps={{ shrink: false }}
                                    onChange={(e) => {
                                        this.setState({
                                            orderNo: e.target.value,
                                        })
                                    }}
                                    value={this.state.orderNo}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Order List Number"
                                    InputProps={{
                                        inputProps: {
                                            style: {
                                                textAlign: 'right',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <LoonsButton
                                        color="error"
                                        style={{
                                            margin: '10px',
                                            width: '10rem',
                                        }}
                                        startIcon={<CachedIcon />}
                                        onClick={() => this.resetTable()}
                                    >
                                        Reset
                                    </LoonsButton>

                                    <LoonsButton
                                        style={{
                                            margin: '10px',
                                            width: '10rem',
                                        }}
                                        type="submit"
                                        startIcon={<SearchIcon />}
                                    >
                                        Search
                                    </LoonsButton>
                                </div>
                            </Grid>
                        </Grid>
                    </ValidatorForm>

                    {/* Load All Order List : Pre Procument */}
                    {!this.state.dataIsLoading && (
                        <LoonsTable
                            id={'allOrderList'}
                            data={this.state.data}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                rowsPerPage: this.state.filterData.limit,
                                page: this.state.filterData.page,
                                onTableChange: (action, tableState) => {
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'sort':
                                            //this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                            console.log('action not handled.')
                                    }
                                },
                            }}
                        ></LoonsTable>
                    )}
                    {/* loader effect : loading table data  */}
                    {this.state.dataIsLoading && (
                        <div
                            className="justify-center text-center w-full pt-12"
                            style={{ height: '50vh' }}
                        >
                            <CircularProgress size={30} />
                        </div>
                    )}
                </LoonsCard>

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={6000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </MainContainer>
        )
    }
}

export default AllOrders
