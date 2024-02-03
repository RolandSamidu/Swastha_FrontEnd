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
import {
    Grid,
    CircularProgress,
    IconButton,
    Tooltip,
    Button,
    Chip,
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DescriptionIcon from '@material-ui/icons/Description'
import CachedIcon from '@material-ui/icons/Cached'
import SearchIcon from '@material-ui/icons/Search'
import PreProcumentService from 'app/services/PreProcumentService'
import TableLable from 'app/components/SpcComponents/TableLable'
import { PageContext } from './PageContext'
import localStorageService from 'app/services/localStorageService'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { dateParse, convertTocommaSeparated } from 'utils'
import GroupAddIcon from '@material-ui/icons/GroupAdd'

export default function AllCommitees() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (pageData) {
            const { limit, page, status } = pageData
            const param = { limit, page, status }

            setDataIsLoading(true)
            const demoData = [
                {
                    name: 'Pharma Minor',
                    type: 'Procurement',
                    validity: '12',
                    authority: 'DPC-Minor',
                },
                {
                    name: 'Bid Opening',
                    type: 'Bid Opening',
                    validity: '12',
                    authority: 'DPC-Major',
                },
            ]
            setTableData(demoData)
            setDataIsLoading(false)
            // PreProcumentService.getAllOrderLists(param)
            //     .then((result) => {
            //         const { data, totalItems } = result.data.view
            //         setTableData(data)
            //         setNoOfData(totalItems)
            //     })
            //     .catch((err) => {})
            //     .finally(() => {
            //         setDataIsLoading(false)
            //     })
        }
    }, [pageData])

    const tablePageHandler = (pageNumber) => {
        const tempPageData = { ...pageData, page: pageNumber }
        setPageData(tempPageData)
    }
    // between all and single page
    const pageHandler = (id) => {
        const tempPageData = {
            ...pageData,
            slug: id,
        }
        setPageData(tempPageData)
    }

    const tableColumns = [
        {
            name: 'name', // field name in the row object
            label: 'Committee Name', // column title that will be shown in table
            options: {
                filter: false,
                display: true,
            },
        },
        {
            name: 'type',
            label: 'Type',
            options: {
                // filter: true,
            },
        },
        {
            name: 'validity',
            label: 'Validity Period (Months)',
            options: {
                // filter: true,
            },
        },
        {
            name: 'authority',
            label: 'Authority Level',
            options: {
                // filter: true,
            },
        },
        {
            name: 'attachments',
            label: 'Authority Level',
            options: {
                // filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <IconButton className="text-black" onClick={null}>
                            <FileCopyIcon />
                        </IconButton>
                    )
                },
            },
        },
        {
            name: 'action',
            label: 'Action',
            options: {
                filter: true,
                display: true,
                customBodyRender: (id) => {
                    return (
                        <Tooltip title="View">
                            <IconButton onClick={() => pageHandler('123')}>
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
                <CardTitle title={'All Commitees'} />
                <Grid
                    container
                    style={{
                        padding: '2rem 1rem',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Grid item xs={2}>
                     
                        <Button
                            startIcon={<GroupAddIcon />}
                            variant="contained"
                            color="primary"
                            style={{ width: '100%' }}
                            onClick={() => pageHandler('new')}
                        >
                            Add New
                        </Button>
                    </Grid>
                </Grid>

                {/* Load All Order List : Pre Procument */}
                {!dataIsLoading && (
                    <LoonsTable
                        id={'allCommitee'}
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
