import React, { useContext, useEffect, useState, useCallback } from 'react'
import {
    DatePicker,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
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
import { dateParse, convertTocommaSeparated } from 'utils'

export default function AllOrders() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (pageData) {
            const { limit, page, status } = pageData
            const param = { limit, page, status }

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

    const tablePageHandler = (pageNumber) => {
        const tempPageData = { ...pageData, page: pageNumber }
        setPageData(tempPageData)
    }
    // between all and single page
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
