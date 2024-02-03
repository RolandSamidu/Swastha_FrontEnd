import React, { useContext, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Chip, Divider, TextareaAutosize } from '@mui/material'
import { LoonsTable } from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { PageContext } from './PageContext'
import { TableRow, TableCell, CircularProgress } from '@material-ui/core'
import ComponentAuthorization from 'app/components/SpcComponents/ComponentAuthorization'
import PreProcumentService from 'app/services/PreProcumentService'
import { dateParse, convertTocommaSeparated } from 'utils'

const customFooter = () => {
    return (
        <TableRow style={{ display: 'flex' }}>
            <TableCell style={{ flexGrow: 1 }} />
            <TableCell style={{ flexGrow: 1 }}>
                <span style={{ fontWeight: 600 }}>Total Quantity</span> : 30
            </TableCell>
            <TableCell style={{ flexGrow: 1 }} />
            <TableCell style={{ flexGrow: 1 }}>
                <span style={{ fontWeight: 600 }}>Total Price</span>: 40
            </TableCell>
        </TableRow>
    )
}

const defaultFilter = {
    order_list_item_id: '',
    limit: 10,
    page: 0,
}

const SingleItemViewCurrent = ({ singleOrderId }) => {
    const [pageData] = useContext(PageContext)

    const [tableData, setTableData] = useState([])
    const [filter, setFilter] = useState(defaultFilter)
    const [dataIsLoading, setDataIsLoading] = useState(true)

    useEffect(() => {
        if (singleOrderId) {
            const tempFilter = filter
            tempFilter.order_list_item_id = singleOrderId

            PreProcumentService.getCurrentItemList(tempFilter)
                .then((result) => {
                    const { data } = result.data.view

                    setTableData(data)
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: SingleItemViewCurrent.jsx:47 ~ PreProcumentService.getSingleOrderLists ~ err:',
                        err
                    )
                }).finally(() => {
                    setDataIsLoading(false)
                })
        }
    }, [singleOrderId])

    const tableOptions = {
        customFooter: customFooter,
    }

    const tableColumns = [
        {
            name: 'OrderListItem',
            label: 'Expected Date',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (OrderListItem) => dateParse(OrderListItem.requirement_to),
            },
        },
        {
            name: 'OrderListItem',
            label: 'Quantity',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (OrderListItem) => convertTocommaSeparated(OrderListItem.quantity, 0)
                ,
            },
        },
        {
            name: 'OrderListItem',
            label: 'Unit Prize',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (OrderListItem) => convertTocommaSeparated(OrderListItem.standard_cost, 2),
            },
        },
        {
            name: 'OrderListItem',
            label: 'Cost',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (OrderListItem) => convertTocommaSeparated(OrderListItem.total_calculated_cost, 2),
            },
        },
    ]

    return (
        <div>
            {/* <Grid container spacing={2}>
                <Grid container item xs={8}>
                    <Grid item xs={12} lg={12} sm={12}>
                        <p
                            style={{
                                margin: 0,
                                color: '#6B728E',
                                fontWeight: 500,
                                fontSize: '18px',
                            }}
                        >
                            Compatible Items
                        </p>
                    </Grid>

                    <Grid item xs={3}>
                        <div className="w-full" style={{ fontWeight: 'bold' }}>
                            SR Number
                        </div>
                        <div className="w-full">022125</div>
                        <div className="w-full">012334</div>
                    </Grid>

                    <Grid item xs={9}>
                        <div className="w-full" style={{ fontWeight: 'bold' }}>
                            Item Name
                        </div>
                        <div className="w-full">Sample Item 1</div>
                        <div className="w-full">Sample Item 2</div>
                    </Grid>
                </Grid>

                <Grid container item xs={4}>
                    <Grid item xs={4}>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            PriorityLevel
                        </p>
                    </Grid>
                    <Grid item xs={8}>
                        <Chip
                            size="small"
                            sx={{
                                backgroundColor: '#B5F1CC',
                                color: '#1F8A70',
                                fontWeight: 600,
                            }}
                            label={'Normal'}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            Order List No
                        </p>
                    </Grid>
                    <Grid item xs={8}>
                        <p style={{ margin: 0 }}>2022/SPC/X/R/P/00306</p>
                    </Grid>
                    <Grid item xs={4}>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            Procurement No
                        </p>
                    </Grid>
                    <Grid item xs={8}>
                        <p style={{ margin: 0 }}> DHS/P/WW12/02</p>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 5 }} /> */}

            <Grid container className="w-full">
                <Grid item xs={2}></Grid>

                <Grid item container xs={8} spacing={3}>
                    <Grid item xs={12}>

                        {dataIsLoading &&
                            <div
                                className="justify-center text-center w-full pt-12"
                                style={{ height: '40vh' }}
                            >
                                <CircularProgress size={30} />
                            </div>}

                        {!dataIsLoading && <LoonsTable
                            id={'compatibleItems'}
                            data={tableData}
                            columns={tableColumns}
                        ></LoonsTable>}

                        {/* <LoonsTable
                            id={'compatibleItems'}
                            data={tableData}
                            columns={tableColumns}
                            options={tableOptions}
                        ></LoonsTable> */}
                    </Grid>

                    <Grid item xs={12}>
                        <p style={{ fontWeight: 500, margin: 0 }}>Document</p>
                        <Divider />
                        <p style={{ margin: 0, padding: '1rem' }}>
                            Not Available
                        </p>
                    </Grid>

                    <Grid item xs={12}>
                        <p style={{ fontWeight: 500, margin: 0 }}>
                            Spacification
                        </p>
                        <Divider />
                        <p style={{ margin: 0, padding: '1rem' }}>
                            Not Available
                        </p>
                    </Grid>

                    <Grid item xs={12}>
                        <p style={{ fontWeight: 500, margin: 0 }}>Note</p>
                        <Divider />
                        <p style={{ margin: 0, padding: '1rem' }}>
                            Not Available
                        </p>
                    </Grid>

                    {/* <Grid item xs={12}>
                        <ComponentAuthorization
                            accessList={['admin', 'SPC MI']}
                            currentUser={pageData.userType}
                        >
                            <p style={{ fontWeight: 500, margin: 0 }}>Remark</p>
                            <TextareaAutosize
                                placeholder="Remark"
                                style={{
                                    minWidth: '100%',
                                    maxWidth: '100%',
                                    minHeight: '50px',
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            />

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <LoonsButton
                                    style={{ margin: '10px' }}
                                    color="error"
                                >
                                    Reject
                                </LoonsButton>
                                <LoonsButton style={{ margin: '10px' }}>
                                    Approve
                                </LoonsButton>
                            </div>
                        </ComponentAuthorization>
                    </Grid> */}
                </Grid>
            </Grid>
        </div>
    )
}

export default SingleItemViewCurrent
