import React, { useContext, useEffect, useState, useCallback } from 'react'
import {
    DatePicker,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Grid, CircularProgress, IconButton, Tooltip } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DescriptionIcon from '@material-ui/icons/Description'
import CachedIcon from '@material-ui/icons/Cached'
import SearchIcon from '@material-ui/icons/Search'
import PreProcumentService from 'app/services/PreProcumentService'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import TableLable from 'app/components/SpcComponents/TableLable'
import { PageContext } from './PageContext'
import localStorageService from 'app/services/localStorageService'
import { dateParse, convertTocommaSeparated, yearParse } from 'utils'

export default function AllOrders() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [orderNo, setOrderNo] = useState(pageData?.filterOrderNo)
    const [dateTo, setDateTo] = useState(pageData?.dateTo)
    const [dateFrom, setDateFrom] = useState(pageData?.dateFrom)
    const [estValueFrom, setEstValueFrom] = useState(pageData?.estValueFrom)
    const [estValueTo, setEstValueTo] = useState(pageData?.estValueTo)

    // on load data handling
    useEffect(() => {
        if (pageData) {
            const param = {
                order_no: pageData.filterOrderNo,
                limit: pageData.limit,
                page: pageData.page,
                status: pageData.status,
            }

            setDataIsLoading(true)

            PreProcumentService.getAllOrderLists(param)
                .then((result) => {
                    const { data, totalItems } = result.data.view
                    setTableData(data)
                    setNoOfData(totalItems)
                })
                .catch((err) => {})
                .finally(() => {
                    setDataIsLoading(false)
                })
        }
    }, [pageData])

    const addCommas = (value) => {
        value = value.replaceAll(',', '')

        value = parseFloat(value)

        if (value.isNaN(value)) {
            return false
        }

        return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    const handleEstValueFrom = (e) => {
        const formattedNum = addCommas(e.target.value)
        if (formattedNum) {
            setDateFrom(formattedNum)
        }
    }

    const tablePageHandler = (pageNumber) => {
        const tempPageData = { ...pageData, page: pageNumber }
        setPageData(tempPageData)
    }
    // between all orders and single page
    const pageHandler = (id, data) => {
        let record = tableData[data.rowIndex]
        const tempPageData = {
            ...pageData,
            slug: id,
            orderNo: record.order_no,
            drugsType: record.Category.description,
        }
        setPageData(tempPageData)
    }
    // handle table filters
    const searchHandler = () => {
        // TODO: validation
        if (orderNo || dateFrom || dateTo || estValueTo || estValueFrom) {
            const tempPageData = {
                ...pageData,
                filterOrderNo: orderNo,
                dateFrom: dateFrom ? yearParse(dateFrom) : null,
                dateTo: dateTo ? yearParse(dateTo) : null,
                estValueTo,
                estValueFrom,
            }
            setPageData(tempPageData)
        }
    }

    const resetTable = () => {
        const tempPageData = {
            ...pageData,
            filterOrderNo: '',
            dateFrom: null,
            dateTo: null,
            estValueTo: '',
            estValueFrom: '',
        }

        setPageData(tempPageData)
        setOrderNo('')
        setDateFrom(null)
        setDateTo(null)
        setEstValueFrom('')
        setEstValueTo('')
    }

    const tableColumns = [
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
                customBodyRender: (status) => <TableLable status={status} />,
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
                            <IconButton onClick={() => pageHandler(id, data)}>
                                <VisibilityIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )
                },
            },
        },
    ]

    return (
        <MainContainer>
            <LoonsCard>
                <CardTitle title={'All Order Lists'} />
                <ValidatorForm
                    onSubmit={searchHandler}
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
                            <SubTitle title={'From'} />
                            <DatePicker
                                className="w-full"
                                placeholder="From"
                                value={dateFrom}
                                onChange={(date) => {
                                    setDateFrom(date)
                                }}
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
                            <SubTitle title={'To'} />

                            <DatePicker
                                className="w-full"
                                placeholder="To"
                                value={dateTo}
                                onChange={(date) => {
                                    setDateTo(date)
                                }}
                            />
                        </Grid>

                        <Grid item lg={2} md={3} sm={6} xs={12}>
                            <SubTitle title={'Est. Value From'} />
                            <TextValidator
                                className=" w-full"
                                name="excess"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="Est. Value From"
                                value={estValueFrom}
                                onChange={handleEstValueFrom}
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
                            <SubTitle title={'Est. Value To'} />

                            <TextValidator
                                className=" w-full"
                                name="To"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="Est. Value To"
                                value={estValueTo}
                                onChange={(e) => setEstValueTo(e.target.value)}
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
                            <SubTitle title={'Order List Number'} />
                            <TextValidator
                                className="w-full"
                                name="Order List Number"
                                InputLabelProps={{ shrink: false }}
                                onChange={(e) => {
                                    setOrderNo(e.target.value)
                                }}
                                value={orderNo}
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
                                    onClick={resetTable}
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
                {!dataIsLoading && (
                    <LoonsTable
                        id={'allOrderList'}
                        data={tableData}
                        columns={tableColumns}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: noOfData,
                            rowsPerPage: pageData.limit,
                            page: pageData.page,
                            onTableChange: (action, tableState) => {
                                switch (action) {
                                    case 'changePage':
                                        tablePageHandler(tableState.page)
                                        break
                                    case 'sort':
                                        //this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                    // TODO: Acction not hanled
                                }
                            },
                        }}
                    ></LoonsTable>
                )}
                {/* loader effect : loading table data  */}
                {dataIsLoading && (
                    <div
                        className="justify-center text-center w-full pt-12"
                        style={{ height: '50vh' }}
                    >
                        <CircularProgress size={30} />
                    </div>
                )}
            </LoonsCard>

            {/* <LoonsSnackbar
                open={this.state.alert}
                onClose={() => {
                    this.setState({ alert: false })
                }}
                message={this.state.message}
                autoHideDuration={6000}
                severity={this.state.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar> */}
        </MainContainer>
    )
}
