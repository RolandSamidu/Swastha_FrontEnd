import React, { useState, useEffect, useContext, useCallback } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    CircularProgress,
    Box,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { PageContext } from './PageContext'
import CommiteeTable from './commiteeTable'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { dateParse } from 'utils'
import SaveIcon from '@material-ui/icons/Save'
const defaultFilterData = {
    limit: 10,
    page: 0,
}

export default function BasicInfo() {
    const [pageData, setPageData] = useContext(PageContext)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState(defaultFilterData)

    const tablePageHandler = (pageNumber) => {
        const tempFilterData = { ...filterData, page: pageNumber }
        setFilterData(tempFilterData)
    }

    useEffect(() => {
        // if (pageData) {
        //     const params = {
        //         ...defaultFilterData,
        //         order_list_id: pageData.slug,
        //     }
        //     setFilterData(params)
        // }
        setDataIsLoading(false)
    }, [pageData])

    const tableColumns = [
        {
            name: 'position', // field name in the row object
            label: 'Position', // column title that will be shown in table
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
            name: 'no_of_positions',
            label: 'No of Positions',
            options: {
                // filter: true,
            },
        },
        {
            name: 'designation',
            label: 'Designation',
            options: {
                // filter: true,
            },
        },
    ]

    return (
        <MainContainer>
            <Card
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#E4FFF6',
                    color: '#003B4A',
                }}
            >
                <CardContent>
                    <Grid container>
                        <Grid item lg={2} md={2} sm={12} xs={12}>
                            <p style={{fontWeight:600}}>Category</p>
                        </Grid>
                        <Grid item lg={10} md={10} sm={12} xs={12}>
                            :
                        </Grid>

                        <Grid item lg={2} md={2} sm={12} xs={12}>
                            <p style={{fontWeight:600}}>Athority Level:</p>
                        </Grid>
                        <Grid item lg={10} md={10} sm={12} xs={12}>
                            :
                        </Grid>

                        <Grid item lg={2} md={2} sm={12} xs={12}>
                            <p style={{fontWeight:600}}>Purpose</p>
                        </Grid>
                        <Grid item lg={10} md={10} sm={12} xs={12}>
                            :
                        </Grid>

                        <Grid item lg={2} md={2} sm={12} xs={12}>
                            <p style={{fontWeight:600}}>Attachment</p>
                        </Grid>
                        <Grid item lg={10} md={10} sm={12} xs={12}>
                            :
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box>
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
            </Box>
        </MainContainer>
    )
}
