import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
    Grid,
    IconButton,
    Tooltip,
    Typography,
    Chip,
    Breadcrumbs,
    Link,
    CircularProgress,
    Button,
} from '@material-ui/core'
import {
    MainContainer,
    LoonsCard,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import PreProcumentService from 'app/services/PreProcumentService'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import PQList from './PQList'
import ModalLG from 'app/components/Modals/ModalLG'
import { PageContext } from './PageContext'
import PCNote from '../Print/PCNote'

const defaultFilterData = {
    limit: 10,
    page: 0,
    order_list_id: '',
}

const formData = {
    date: '03.01.2023',
    orderListNo: '2023/SPC/N/R/S/00587',
    itemSRNo:
        '18600204,18600205... (19 Items) Oral Maxillo-Facail (OMF) Surgery Consymble itmes',
    estTotalCost: '52,294,909.83',
    orderListDate: '09.12.2022',
    itemsForYear: '2023',
    supplyDate: 'January 2023',
}

export default function SingleOrders() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState(defaultFilterData)

    useEffect(() => {
        if (pageData) {
            const params = {
                ...defaultFilterData,
                order_list_id: pageData.slug,
            }
            setFilterData(params)
        }
    }, [pageData])

    const loadTableData = useCallback((params) => {
        setDataIsLoading(true)

        PreProcumentService.getSingleOrderLists(params)
            .then((result) => {
                const { data, totalItems } = result.data.view
                setNoOfData(totalItems)
                setTableData(data)
            })
            .catch((err) => {
                console.log(
                    '🚀 ~ file: SingleOrders.jsx:60 ~ loadTableData ~ err:',
                    err
                )
            })
            .finally(() => {
                setDataIsLoading(false)
            })
    }, [])

    useEffect(() => {
        if (filterData.order_list_id) {
            loadTableData(filterData)
        }
    }, [filterData, loadTableData])

    const viewAllOrderList = () => {
        const tempPageData = { ...pageData, slug: 0 }
        setPageData(tempPageData)
    }

    const tablePageHandler = (pageNumber) => {
        const tempFilterData = { ...filterData, page: pageNumber }
        setFilterData(tempFilterData)
    }

    const tableColumns = [
        {
            name: 'ItemSnap',
            label: 'SR Number',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (ItemSnap) => ItemSnap.sr_no,
            },
        },
        {
            name: 'ItemSnap',
            label: 'Item Name',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (ItemSnap) => ItemSnap.medium_description,
            },
        },

        {
            name: 'quantity',
            label: 'Order Quantity',
            options: {
                display: true,
            },
        },
        {
            name: 'total_calculated_cost',
            label: 'Estimated Total Cost (LKR)M',
            options: {
                display: true,
            },
        },

        {
            name: 'priority_level',
            label: 'Priority Level',
            options: {
                display: true,
            },
        },
        {
            name: 'Packing',
            label: 'Packing',
            options: {
                display: true,
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                display: true,
            },
        },
        // {
        //     name: 'action',
        //     label: 'Action',
        //     options: {
        //         display: true,

        //         customBodyRenderLite: (dataIndex) => {
        //             const record = this.state.data[dataIndex]

        //             return (
        //                 <ModalXL
        //                     title={`SR Number : ${record?.ItemSnap.sr_no}`}
        //                     button={
        //                         <Tooltip title="View Document">
        //                             <IconButton>
        //                                 <VisibilityIcon color="primary" />
        //                             </IconButton>
        //                         </Tooltip>
        //                     }
        //                 >
        //                     <SingleItemViewTabNav singleOrderId={record.id} />
        //                 </ModalXL>
        //             )
        //         },
        //     },
        // },
    ]

    return (
        <MainContainer>
            <LoonsCard style={{ minHeight: '80vh' }}>
                <Grid container>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Tooltip title="Back to All Orders">
                            <IconButton
                                onClick={viewAllOrderList}
                                style={{ padding: '1rem' }}
                                size="medium"
                            >
                                <ArrowBackIosIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>

                        <p
                            style={{
                                margin: 0,
                                padding: '1rem',
                                color: '#6B728E',
                                fontWeight: 600,
                                fontSize: '18px',
                            }}
                        >{`Order - ${pageData.orderNo}`}</p>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                component="button"
                                color="inherit"
                                onClick={viewAllOrderList}
                            >
                                All Order List
                            </Link>
                            <Typography color="textPrimary">
                                Single Order List
                            </Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Tooltip title="Drug Type">
                            <Chip
                                color="secondary"
                                label={pageData.drugsType}
                            />
                        </Tooltip>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        container
                        spacing={3}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Grid item xs={2}>
                            <ModalLG
                                title={`PQ List`}
                                button={
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ width: '100%' }}
                                        startIcon={<PlaylistAddCheckIcon />}
                                    >
                                        Check PQ
                                    </Button>
                                }
                            >
                                <PQList />
                            </ModalLG>
                        </Grid>

                        <Grid item xs={2}>
                            <PCNote formData={formData} />
                        </Grid>
                    </Grid>
                </Grid>

                {!dataIsLoading && (
                    <LoonsTable
                        id={'completed'}
                        data={tableData}
                        columns={tableColumns}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: noOfData,
                            rowsPerPage: filterData.limit,
                            page: filterData.page,
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

                {dataIsLoading && (
                    <div
                        className="justify-center text-center w-full pt-12"
                        style={{ height: '50vh' }}
                    >
                        <CircularProgress size={30} />
                    </div>
                )}
            </LoonsCard>
        </MainContainer>
    )
}
