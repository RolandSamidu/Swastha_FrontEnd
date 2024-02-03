import React, { useContext, useEffect, useState } from 'react'
import {
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import {
    Grid,
    CircularProgress,
    IconButton,
    Tooltip,
    FormControl,
    Button,
    InputAdornment,
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import SearchIcon from '@material-ui/icons/Search'
import { PageContext } from './PageContext'
import * as appConst from 'appconst'

import SPCServices from 'app/services/SPCServices'
import { dateParse } from 'utils'

import SortIcon from '@mui/icons-material/Sort';
import PrintIcon from '@mui/icons-material/Print';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import localStorageService from 'app/services/localStorageService'
import PrescriptionService from 'app/services/PrescriptionService'
import InventoryService from 'app/services/InventoryService'

import PurchaseOrderList from 'app/views/SPC/Print/PurchesOrder'

const tempData = [
    {
        "POType": "F",
        "PONumber": "1235889",
        "tenderNo": "DHS/RS/EP/27/2022",
        "intentNo": "LP/DHS/RS/EP/27/527KC/2022",
        "orderNo": "2023/SPC/N/S/0046",
    }
]

export default function AllPurchaseOrder() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [noOfDataApproval, setNoOfDataApproval] = useState(0)
    const [tableData, setTableData] = useState([])
    const [tableDataApproval, setTableDataApproval] = useState([])
    const [PONo, setPONo] = useState(pageData?.filterPONo)
    const [IndentNo, setIndentNo] = useState(pageData?.filterIndentNo)
    const [search, setSearch] = useState(pageData?.filterSearch)
    const [POStatus, setPOStatus] = useState(pageData?.POStatus);
    const [purchaseOrderData, setPurchaseOrderData] = useState([])
    const [printLoaded, setPrintLoaded] = useState(false)
    const [userName, setUserName] = useState(null)

    const [POType, setPOType] = useState(pageData?.POType);

    useEffect(() => {
        let userRoles = localStorageService.getItem('userInfo')?.roles
        setPageData({ ...pageData, userRoles: userRoles })
    }, [])

    useEffect(() => {
        if (pageData) {
            setDataIsLoading(true)
            const pendingParam = {
                limit: pageData.limit,
                page: pageData.page,
                // status: 'Draft',
                status: ['Pending Approval', 'SUPERVISOR APPROVED'],
                po_type: pageData.POType ? pageData.POType === 'F' ? ["F", "Foreign"] : ["Local", 'L'] : pageData.POType,
                po_no: pageData.filterPONo,
                search: pageData.filterSearch,
                indent_no: pageData.filterIndentNo,
                'order[0]': ['createdAt', 'DESC'],
            }

            const approvalParam = {
                limit: pageData.limit,
                page: pageData.page,
                // status: 'Draft',
                status: ['Pending'],
                'order[0]': ['createdAt', 'DESC'],
                role: pageData.userRoles,
                po_type: pageData.POType ? pageData.POType === 'F' ? ["F", "Foreign"] : ["Local", 'L'] : pageData.POType,
                po_no: pageData.filterPONo,
                indent_no: pageData.filterIndentNo,
                search: pageData.filterSearch
            }

            if (Array.isArray(pageData.userRoles) && pageData.userRoles.length > 0) {
                console.log("Role: ", pageData.userRoles, typeof (pageData.userRoles))
                if (Array.isArray(pageData.userRoles) && (pageData.userRoles.includes('SPC Supervisor') || pageData.userRoles.includes('SPC MI') || pageData.userRoles.includes('SPC Procurement Officer') || pageData.userRoles.includes('SPC DGM'))) {
                    SPCServices.getAllPurchaseApprovals(approvalParam).then((result) => {
                        const { data, totalItems } = result.data.view
                        console.log('checking user role', data)
                        setTableDataApproval(data)
                        setNoOfDataApproval(totalItems)

                    }).catch((error) => {
                        console.log("🚀 ~ file: AllPurchaseOrder.jsx:59 ~ SPCServices.AllPurchaseOrder ~ error:", error)

                    }).finally(() => {
                        setDataIsLoading(false)
                    })
                } else {
                    SPCServices.getAllPurchaseOrders(pendingParam).then((result) => {
                        const { data, totalItems } = result.data.view

                        setTableData(data)
                        setNoOfData(totalItems)

                    }).catch((error) => {
                        console.log("🚀 ~ file: AllPurchaseOrder.jsx:59 ~ SPCServices.AllPurchaseOrder ~ error:", error)

                    }).finally(() => {
                        setDataIsLoading(false)
                    })
                }
            }
        }
    }, [pageData])

    const tablePageHandler = (pageNumber) => {
        const tempPageData = { ...pageData, page: pageNumber }
        setPageData(tempPageData)
    }

    // between  single page
    const pageHandler = (data) => {
        console.log('checking id', data)
        const tempPageData = {
            ...pageData,
            slug: 'po',
            PONo: PONo,
            filterPONo: PONo,
            filterIndentNo: IndentNo,
            filterSearch: search,
            id: data.id,
            orderId: data?.order_list_id,
            orderNo: data.order_no,
        }
        setPageData(tempPageData)
    }

    // between  single page approval
    const pageHandlerApproval = (data) => {
        console.log('checking id', data)
        const tempPageData = {
            ...pageData,
            slug: 'po',
            PONo: PONo,
            filterPONo: PONo,
            filterIndentNo: IndentNo,
            filterSearch: search,
            id: data.purchase_order_id,
            orderId: data?.MSDPurchaseOrder?.order_list_id,
            orderNo: data.order_no,
            approval_id: data.id,
            isApproved: false,
        }
        setPageData(tempPageData)
    }

    const searchHandler = () => {
        // TODO: handle data
        const tempPageData = {
            ...pageData,
            filterPONo: PONo,
            filterIndentNo: IndentNo,
            filterSearch: search,
            POType
        }

        setPageData(tempPageData)
    }

    const resetTable = () => {
        const tempPageData = {
            ...pageData,
            filterPONo: '',
            filterIndentNo: '',
            filterSearch: '',
            POStatus: '',
            page: 0,
        }

        setPageData(tempPageData)
        setPONo('')
        setIndentNo('')
        setSearch('')
        setPOStatus('')
    }

    const printData = async (purchaseId) => {
        let userName = await localStorageService.getItem('userInfo')?.name
        setPrintLoaded(false)
        console.log('clicked', purchaseId)

        let res = await PrescriptionService.NP_Orders_By_Id({}, purchaseId)
        if (res.status === 200) {
            console.log('pdata', res.data.view)
            setUserName(userName)
            getUOMByID(res.data.view)
        }
    }

    const getUOMByID = async (data) => {
        let list = data.POItem.map((i) => i.item.id)
        let params = {
            item_snap_id: list
        }
        const res = await InventoryService.GetUomById(params)
        let updatedArray = []
        if (res.status === 200) {
            updatedArray = data?.POItem.filter((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.ItemSnap?.id === obj1.item?.id);
                obj1.uom = obj2?.UOM?.name
                return obj1;
            });
            data.POItem = updatedArray;
        }
        setPrintLoaded(true);
    }

    useEffect(() => {
        if (printLoaded) {
            document.getElementById('print_presc_004').click();
            setPrintLoaded(false);
        }
    }, [printLoaded]);

    const tablePendingColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
                            {/* <Tooltip title="Print Data">
                                <IconButton
                                    // onClick={() => printData(tempTableData?.order_list_id)}
                                    onClick={() => null}
                                >
                                    <PrintIcon color="primary" />
                                </IconButton>
                            </Tooltip> */}
                            <Tooltip title="View">
                                <IconButton onClick={() => pageHandler(tempTableData)}>
                                    <VisibilityIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_no',
            label: 'PO Number',
            options: {
                display: true,
            },
        },
        {
            name: 'po_type',
            label: 'Type',
            options: {
                display: true,
            },
        },
        {
            name: 'tender_no',
            label: 'Tender No',
            options: {
                display: true,
            },
        },
        {
            name: 'indent_no',
            label: 'Indent No',
            options: {
                display: true,
            },
        },
        {
            name: 'order_no',
            label: 'Order No',
            options: {
                display: true,
            },
        },
        {
            name: 'Employee',
            label: 'Created By',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (Employee) => Employee?.name ? Employee?.name : "N/A",
            },
        },
        {
            name: 'createdAt',
            label: 'Created At',
            options: {
                display: true,
                customBodyRender: (date) => {
                    date = dateParse(date)
                    return date
                },
            },
        },
    ]

    const tableApprovalColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (
                        <Grid className="px-2">
                            {/* <Tooltip title="Print Data">
                                <IconButton
                                    // onClick={() => printData(tempTableData?.order_list_id)}
                                    onClick={() => null}
                                >
                                    <PrintIcon color="primary" />
                                </IconButton>
                            </Tooltip> */}
                            <Tooltip title="View">
                                <IconButton onClick={() => pageHandlerApproval(tempTableData)}>
                                    <VisibilityIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_no',
            label: 'PO Number',
            options: {
                display: true,
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder ? MSDPurchaseOrder : "N/A",
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder?.po_no ? MSDPurchaseOrder?.po_no : "N/A",
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (tempTableData?.MSDPurchaseOrder?.po_no)
                }
            },
        },
        {
            name: 'po_type',
            label: 'Type',
            options: {
                display: true,
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder ? MSDPurchaseOrder : "N/A",
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder?.po_type ? MSDPurchaseOrder?.po_type : "N/A",
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (tempTableData?.MSDPurchaseOrder?.po_type)
                }
            },
        },
        {
            name: 'tender_no',
            label: 'Tender No',
            options: {
                display: true,
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder ? MSDPurchaseOrder : "N/A",
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder?.tender_no ? MSDPurchaseOrder?.tender_no : "N/A",
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (tempTableData?.MSDPurchaseOrder?.tender_no)
                }
            },
        },
        {
            name: 'indent_no',
            label: 'Indent No',
            options: {
                display: true,
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder ? MSDPurchaseOrder : "N/A",
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder?.indent_no ? MSDPurchaseOrder?.indent_no : "N/A",
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (tempTableData?.MSDPurchaseOrder?.indent_no)
                }
            },
        },
        {
            name: 'order_no',
            label: 'Order No',
            options: {
                display: true,
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder ? MSDPurchaseOrder : "N/A",
                // customBodyRender: (MSDPurchaseOrder) => MSDPurchaseOrder?.order_no ? MSDPurchaseOrder?.order_no : "N/A",
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (tempTableData?.MSDPurchaseOrder?.order_no)
                }
            },
        },
        {
            name: 'Employee',
            label: 'Created By',
            options: {
                display: true,
                filter: true,
                sort: true,
                // customBodyRender: (Employee) => Employee?.name ? Employee?.name : "N/A",
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableDataApproval[dataIndex]
                    return (tempTableData?.MSDPurchaseOrder?.Employee ? tempTableData?.MSDPurchaseOrder?.Employee?.name : 'N/A')
                }
            },
        },
        {
            name: 'createdAt',
            label: 'Created At',
            options: {
                display: true,
                customBodyRender: (date) => {
                    date = dateParse(date)
                    return date
                },
            },
        },
    ]

    return (
        <div style={{ width: '100%' }}>

            <ValidatorForm onSubmit={searchHandler}>
                <Grid container spacing={2} className="py-1">
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                        {/* <FormControl className="w-full">
                            <SubTitle title={'Status'}></SubTitle>
                            <Autocomplete
                                className="w-full"
                                options={appConst.order_list_status}
                                getOptionLabel={(option) => option.label}
                                value={POStatus ? appConst.order_list_status.find((rs) => rs.label === POStatus) : null}
                                onChange={(event, value) => {
                                    setPOStatus(value?.label)
                                }}
                                getOptionSelected={(option, value) =>
                                    option.label === value?.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Status"
                                        value={POStatus}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </FormControl> */}
                        <FormControl className="w-full">
                            <SubTitle title={'PO Type'}></SubTitle>
                            <Autocomplete
                                className="w-full"
                                value={POType ? { label: POType } : null}
                                options={appConst.po_type}
                                onChange={(event, value) => {
                                    setPOType(value?.label)
                                }}
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    option.label === value.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="PO Type"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={POType || ''}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                        <ValidatorForm>
                            <SubTitle title="Purchase Order No" />
                            <TextValidator
                                className=""
                                placeholder="Order No"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={PONo || ''}
                                onChange={(e) => setPONo(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={searchHandler}>
                                                <SearchIcon></SearchIcon>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ValidatorForm>
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                        <ValidatorForm>
                            <SubTitle title="Indent No" />
                            <TextValidator
                                className=""
                                placeholder="Indent No"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={IndentNo || ''}
                                onChange={(e) => setIndentNo(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={searchHandler}>
                                                <SearchIcon></SearchIcon>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ValidatorForm>
                    </Grid>
                    <Grid item lg={3} md={4} sm={6} xs={12}>
                        <ValidatorForm>
                            <SubTitle title="Search" />
                            <TextValidator
                                className=""
                                placeholder="Search"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={search || ''}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={searchHandler}>
                                                <SearchIcon></SearchIcon>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ValidatorForm>
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    // style={{ padding: '2rem 1rem' }}
                    >
                        <Grid container spacing={2} className='my-2'>
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className=" w-full flex justify-end"
                                style={{ paddingRight: 0 }}
                            >
                                <FormControl className='px-2 py-2'>
                                    <Button
                                        style={{ backgroundColor: "#DC3545" }}
                                        variant="contained"
                                        onClick={resetTable}
                                        startIcon={<LayersClearIcon />}
                                    >
                                        Reset Table
                                    </Button>
                                </FormControl>
                                <FormControl className='px-2 py-2'>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<SortIcon />}
                                    >
                                        Apply Filter
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>

            {/* Load All Order List : Pre Procument */}
            {!dataIsLoading && (
                Array.isArray(pageData.userRoles) && (pageData.userRoles.includes('SPC Supervisor') || pageData.userRoles.includes('SPC MI') || pageData.userRoles.includes('SPC Procurement Officer') || pageData.userRoles.includes('SPC DGM')) ?
                    <LoonsTable
                        id={'allPurchaseOrder'}
                        data={tableDataApproval}
                        columns={tableApprovalColumns}
                        // columns={Array.isArray(pageData.userRoles) && pageData.userRoles.includes('SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM') ? tableApprovalColumns : tablePendingColumns}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: noOfDataApproval,
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
                    : <LoonsTable
                        id={'allPurchaseOrder'}
                        data={tableData}
                        columns={tablePendingColumns}
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
            {printLoaded &&
                <PurchaseOrderList purchaseOrderData={purchaseOrderData} userName={userName} />
            }

        </div>
    )
}
