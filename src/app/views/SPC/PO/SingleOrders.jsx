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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
} from '@material-ui/core'
import {
    MainContainer,
    LoonsCard,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import PreProcumentService from 'app/services/PreProcumentService'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import ModalXL from 'app/components/Modals/ModalXL'
import ModalLG from 'app/components/Modals/ModalLG'
import { PageContext } from './PageContext'

const defaultFilterData = {
    limit: 10,
    page: 0,
    order_list_id: '',
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
                        <Grid item xs={4}>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-label">
                                    Assing Clerk
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                >
                                    <MenuItem value={10}>user 1</MenuItem>
                                    <MenuItem value={20}>user 2</MenuItem>
                                    <MenuItem value={30}>user 3</MenuItem>
                                </Select>
                            </FormControl>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <FormControl style={{ margin: '1rem 0' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PersonAddIcon />}
                                    >
                                        Assing Clerk
                                    </Button>
                                </FormControl>
                            </div>
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
