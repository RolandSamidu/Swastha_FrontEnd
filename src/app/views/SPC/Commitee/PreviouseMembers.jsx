import React, { useState } from 'react'
import { Grid, CircularProgress, FormControl, Button } from '@material-ui/core'
import {
    MainContainer,
    LoonsTable,
    DatePicker,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'

const defaultFilterData = {
    limit: 10,
    page: 0,
}
export default function PreivouseMembers() {
    const [dataIsLoading, setDataIsLoading] = useState(false)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [dateTo, setDateTo] = useState()
    const [dateFrom, setDateFrom] = useState()
    const [position, setPosition] = useState('')
    const [memberName, setMemberName] = useState('')
    const [filterData, setFilterData] = useState(defaultFilterData)

    const temp = [
        { id: 1, label: 'B101' },
        { id: 2, label: 'B102' },
        { id: 3, label: 'B103' },
    ]

    const tablePageHandler = (pageNumber) => {
        const tempFilterData = { ...filterData, page: pageNumber }
        setFilterData(tempFilterData)
    }

    const tableColumns = [
        {
            name: 'name', // field name in the row object
            label: 'Member Name', // column title that will be shown in table
            options: {
                filter: false,
                display: true,
            },
        },
        {
            name: 'position',
            label: 'Position',
            options: {
                // filter: true,
            },
        },
        {
            name: 'from',
            label: 'From',
            options: {
                // filter: true,
            },
        },
        {
            name: 'to',
            label: 'To',
            options: {
                // filter: true,
            },
        },
    ]

    return (
        <MainContainer>
            <ValidatorForm>
                <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="From" />
                            <DatePicker
                                className="w-full"
                                placeholder="From"
                                value={dateFrom}
                                onChange={(date) => {
                                    setDateFrom(date)
                                }}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title={'To'} />
                            <DatePicker
                                className="w-full"
                                placeholder="To"
                                value={dateTo}
                                onChange={(date) => {
                                    setDateTo(date)
                                }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Position" />
                            <Autocomplete
                                className="w-half"
                                options={temp}
                                onChange={(e, value) => {
                                    setPosition(value)
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Position"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={position}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl className="w-full">
                            <SubTitle title="Member Name" />
                            <TextValidator
                                className=" w-full"
                                name="to"
                                InputLabelProps={{ shrink: false }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                placeholder="Member Name"
                            />
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Grid item lg={2} md={2} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <Button
                                    startIcon={<SearchIcon />}
                                    variant="contained"
                                    color="primary"
                                >
                                    Add New
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {!dataIsLoading && (
                        <LoonsTable
                            id={'members'}
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
                    {/* loader effect : loading table data  */}
                    {dataIsLoading && (
                        <div
                            className="justify-center text-center w-full pt-12"
                            style={{ height: '50vh' }}
                        >
                            <CircularProgress size={30} />
                        </div>
                    )}
                </Grid>
            </Grid>
        </MainContainer>
    )
}
