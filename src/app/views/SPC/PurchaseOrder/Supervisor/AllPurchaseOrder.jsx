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
    const [tableData, setTableData] = useState([])
    const [PONo, setPONo] = useState(pageData?.filterPONo)
    const [POStatus, setPOStatus] = useState(pageData?.POStatus);

    useEffect(() => {
        if (pageData) {
            // const param = {
            //     limit: pageData.limit,
            //     page: pageData.page,
            //     // order_no: pageData.filterOrderNo,
            //     'order[0]': ['updatedAt', 'DESC'],
            // }
            // TODO update with real data
            setTableData(tempData)
            setNoOfData(1)
            setDataIsLoading(false)
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
            slug: 'po',
            PONo: PONo
        }
        setPageData(tempPageData)
    }

    const searchHandler = () => {
        // TODO: handle data
        const tempPageData = {
            ...pageData,
            POStatus
        }

        setPageData(tempPageData)
    }

    const resetTable = () => {
        const tempPageData = {
            ...pageData,
            filterPONo: '',
            POStatus: '',
            page: 0,
        }

        setPageData(tempPageData)
        setPONo('')
        setPOStatus('')

    }

    const tableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
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
            name: 'PONumber',
            label: 'PO Number',
            options: {
                display: true,
            },
        },
        {
            name: 'POType',
            label: 'Type',
            options: {
                display: true,
            },
        },
        {
            name: 'tenderNo',
            label: 'Tender No',
            options: {
                display: true,
            },
        },
        {
            name: 'intentNo',
            label: 'Intent No',
            options: {
                display: true,
            },
        },
        {
            name: 'orderNo',
            label: 'Order No',
            options: {
                display: true,
            },
        },
    ]

    return (
        <MainContainer>
            <LoonsCard style={{ minHeight: '80vh' }}>
                <CardTitle title={'All Purchase Order'} />
                <ValidatorForm onSubmit={searchHandler}>
                    <Grid container spacing={2} className="py-1">
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                        </Grid>

                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <FormControl className="w-full">
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
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
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
                                                <SearchIcon></SearchIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </ValidatorForm>
                        </Grid>

                        <Grid
                            item
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ padding: '2rem 1rem' }}
                        >
                            <FormControl className="w-full">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Apply Filter
                                </Button>
                            </FormControl>

                            <FormControl className="w-full mt-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={resetTable}
                                >
                                    Reset Table
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ValidatorForm>

                {/* Load All Order List : Pre Procument */}
                {!dataIsLoading && (
                    <LoonsTable
                        id={'allPurchaseOrder'}
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
