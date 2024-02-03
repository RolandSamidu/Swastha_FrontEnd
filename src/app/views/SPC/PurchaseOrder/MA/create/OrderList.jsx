import React, { useContext, useEffect, useState } from 'react'
import {
    DatePicker,
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
    CircularProgress,
    IconButton,
    Tooltip,
    FormControl,
    Button,
    InputAdornment,
} from '@material-ui/core'
// import VisibilityIcon from '@material-ui/icons/Visibility'
import SearchIcon from '@material-ui/icons/Search'
import SchedulesServices from 'app/services/SchedulesServices'
import { PageContext } from './PageContext'
// import localStorageService from 'app/services/localStorageService'
import AddIcon from '@mui/icons-material/Add'
import SortIcon from '@mui/icons-material/Sort';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import {
    dateTimeParse,
    convertTocommaSeparated,
    dateParse,
    yearParse,
} from 'utils'
import * as appConst from 'appconst'
import PreProcumentService from 'app/services/PreProcumentService'
import localStorageService from 'app/services/localStorageService'

export default function OrderList() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [orderNo, setOrderNo] = useState(pageData?.filterOrderNo)
    const [dateTo, setDateTo] = useState(pageData?.dateTo)
    const [dateFrom, setDateFrom] = useState(pageData?.dateFrom)
    const [status, setStatus] = useState(pageData?.status)
    const [type, setType] = useState(pageData?.type)
    const [year, setYear] = useState(pageData?.year)

    useEffect(() => {
        let userRoles = localStorageService.getItem('userInfo')?.roles
        setPageData({ ...pageData, userRoles: userRoles })
    }, [])

    useEffect(() => {
        if (pageData) {
            const param = {
                limit: pageData.limit,
                page: pageData.page,
                status: pageData.status === "APPROVED" ? ['SPC.APPROVED', 'SPC.approved.review.approved', 'APPROVED'] : pageData.status ? [pageData.status] : pageData.status,
                from: pageData.dateFrom,
                to: pageData.dateTo,
                year: pageData.year,
                type: pageData.type,
                order_no: pageData.filterOrderNo,
                'order[0]': ['updatedAt', 'DESC'],
            }

            setDataIsLoading(true)

            PreProcumentService.getAllOrderLists(param)
                .then((result) => {
                    const { data, totalItems } = result.data.view

                    setTableData(data)
                    setNoOfData(totalItems)
                })
                .catch((err) => { })
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
    const pageHandler = (data) => {
        const tempPageData = {
            ...pageData,
            slug: 'create',
            orderNo: data.order_no,
            categoryId: data.category_id,
            category: data?.Category?.description,
            type: data.type,
            orderId: data.id
        }
        setPageData(tempPageData)
    }

    const searchHandler = () => {
        // TODO: validation
        if (orderNo || dateFrom || dateTo || status || type || year) {

            const tempPageData = {
                ...pageData,
                filterOrderNo: orderNo,
                page: 0,
                dateFrom,
                dateTo,
                status,
                type,
                year,
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
            status: '',
            type: '',
            year: null,
            page: 0,
        }

        setPageData(tempPageData)
        setOrderNo('')
        setDateTo(null)
        setDateFrom(null)
        setYear(null)
        setStatus('')
        setType(null)
    }

    const tableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    // let order_no = tableData[dataIndex]?.order_no
                    // let order_list_id = tableData[dataIndex]?.id
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
                            {/* <IconButton
                                onClick={() => {
                                    window.location.href = `/order/order-list/${order_list_id}`
                                }}>
                                <VisibilityIcon color='primary' />
                            </IconButton> */}

                            <IconButton
                                /*  disabled={
                                     tempTableData.status == 'Pending Approval'
                                 } */
                                disabled={Array.isArray(pageData.userRoles) && !pageData.userRoles.includes('SPC MA') ? true : false}
                                onClick={() => pageHandler(tempTableData)}
                            >
                                <AddIcon color={Array.isArray(pageData.userRoles) && !pageData.userRoles.includes('SPC MA') ? "disabled" : "primary"}/* color={tempTableData.status === 'Pending Approval' ? "disabled" : "primary"} */ />
                            </IconButton>

                            {/* {this.state.userRoles.includes('MSD AD') ? null :
                                <IconButton>
                                    <OrderList orderId={this.state.data[dataIndex].id} orderListId={this.state.data[dataIndex].order_no} userName={this.state.data[dataIndex].Employee.name} />
                                </IconButton>
                            } */}
                        </Grid>
                    )
                },
            },
        },
        {
            name: 'order_no',
            label: 'Order List number',
            options: {
                display: true,
            },
        },
        {
            name: 'type',
            label: 'Type',
            options: {
                display: true,
            },
        },
        {
            name: 'no_of_items',
            label: 'No Of Items',
            options: {
                display: true,
            },
        },
        {
            name: 'order_for_year',
            label: 'Order for Year',
            options: {
                display: true,
            },
        },
        {
            name: 'order_date',
            label: 'Order Date',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (orderDate) => {
                    return orderDate ? dateParse(orderDate) : ''
                },
            },
        },
        {
            name: 'order_date_to',
            label: 'Order Date To',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (orderDateTo) => {
                    return orderDateTo ? dateParse(orderDateTo) : ''
                },
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    if (tempTableData?.status === 'SPC.APPROVED' || tempTableData?.status === "SPC.approved.review.approved") {
                        return "APPROVED"
                    }
                    return tempTableData?.status ? tempTableData?.status : "N/A"
                },
            },
        },
    ]

    return (
        <MainContainer>
            <LoonsCard>
                <CardTitle title={'All Order Lists'} />
                <ValidatorForm onSubmit={searchHandler}>
                    <Grid container spacing={2} className="py-1">
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title={'Status'}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={appConst.order_list_status}
                                    // defaultValue={{ value: status }}
                                    value={{ value: status }}
                                    getOptionLabel={(option) => option.value}
                                    onChange={(event, val) => {
                                        setStatus(val?.value)
                                    }}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Status"
                                            //variant="outlined"
                                            value={status}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title={'Type'}></SubTitle>
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={appConst.order_list_catogory}
                                    getOptionLabel={(option) => option.label}
                                    // defaultValue={{ label: type }}
                                    value={{ label: type }}
                                    onChange={(event, value) => {
                                        setType(value?.label)
                                    }}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Type"
                                            value={type}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Date From" />
                                <DatePicker
                                    className="w-full"
                                    value={dateFrom}
                                    placeholder="Date From"
                                    onChange={(date) => {
                                        let tempDate = dateParse(date)
                                        setDateFrom(tempDate)
                                    }}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Date To" />
                                <DatePicker
                                    className="w-full"
                                    value={dateTo}
                                    variant="outlined"
                                    placeholder="Date To"
                                    onChange={(date) => {
                                        let tempDate = dateParse(date)
                                        setDateTo(tempDate)
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Year" />
                                <DatePicker
                                    className="w-full"
                                    value={year}
                                    variant="outlined"
                                    placeholder="Year"
                                    onChange={(date) => {
                                        let tempYear = yearParse(date)
                                        setYear(tempYear)
                                    }}
                                />
                            </FormControl>

                            <ValidatorForm>
                                <SubTitle title="Order List No" />
                                <TextValidator
                                    className=""
                                    placeholder="Order No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={orderNo}
                                    onChange={(e) => setOrderNo(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon></SearchIcon>
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
        </MainContainer>
    )
}
