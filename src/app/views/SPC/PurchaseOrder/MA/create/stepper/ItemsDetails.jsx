import React, {
    useState,
    useContext,
    useEffect,
    useCallback,
    useRef,
} from 'react'
import SearchIcon from '@material-ui/icons/Search'
import Button from 'app/components/LoonsLabComponents/Button'
import { Grid, Tooltip, Chip, CircularProgress, InputAdornment } from '@material-ui/core'
import { MainContainer, LoonsTable, LoonsSnackbar, CardTitle, ValidatorForm, SubTitle } from 'app/components/LoonsLabComponents'
import { PageContext } from '../PageContext'
import SchedulesServices from 'app/services/SchedulesServices'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import { dateParse } from 'utils'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import AssignItem from './AssignItem'
import { makeStyles } from '@material-ui/core/styles';
import PreProcumentService from 'app/services/PreProcumentService'
import { Autocomplete } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { FormControl } from '@mui/material'
import LayersClearIcon from '@mui/icons-material/LayersClear';

const defaultFilterData = {
    limit: 10,
    page: 0,
    // order_no: null,
    order_list_id: '',
    'order[0]': ['updatedAt', 'DESC'],
    // agent_type: '',
}


const useStyles = makeStyles((theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

const AcctionButton = ({ onClick, status, disabled }) => {
    if (status) {
        return (
            <Chip
                size="small"
                icon={<DoneIcon />}
                label="Assigned"
                onDelete={onClick}
                deleteIcon={<EditIcon />}
                color={disabled ? "#dddddd" : "secondary"}
            />
        )
    } else {
        return (
            <Tooltip title={disabled ? "No Available Qty" : "Assign Item"}>
                <IconButton onClick={onClick}>
                    <EditIcon size="small" color={disabled ? 'error' : "primary"} />
                </IconButton>
            </Tooltip>
        )
    }
}

export default function ItemsDetails({ POData }) {
    const classes = useStyles()
    const [pageData, setPageData] = useContext(PageContext)
    const [filterData, setFilterData] = useState(defaultFilterData)
    const [dataIsLoading, setDataIsLoading] = useState(true)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [rowData, setRowData] = useState({})
    const [selectedId, setSelectedId] = useState(-1)
    const [open, setOpen] = useState(false)
    const [srNo, setSrNo] = useState(null)
    const [itemList, setItemList] = useState([])
    const [item, setItem] = useState(null)
    const assignList = useRef([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const setParam = async () => {
            const params = {
                ...defaultFilterData,
                order_list_id: pageData.orderId,
                order_by_sr: "ASC"
                // order_no: pageData.orderNo,
                // agent_type: 'SPC',
            }
            setFilterData(params)
        }

        if (pageData) {
            setParam()
        }
    }, [pageData])

    useEffect(() => {
        assignList.current = POData.current.ItemsDetails || []
    }, [POData])

    const loadTableData = useCallback((params) => {
        setDataIsLoading(true)

        // SchedulesServices.getScheduleOrderList(params)
        PreProcumentService.getSingleOrderLists(params)
            .then((result) => {
                const { data, totalItems } = result.data.view
                // check whether item is assing
                const tempData = data.map((res) => {
                    if (assignList.current.length !== 0) {

                        let tempItemData = assignList.current.find((rs) => rs.rowData.id === res.id)
                        if (tempItemData) {
                            return { ...res, assing: true }
                        }

                    }
                    return { ...res, assing: false }
                })

                setNoOfData(totalItems)
                setTableData(tempData)
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


    const sortItems = (items) => {
        return items.sort((a, b) => {
            const srA = parseInt(a?.rowData?.ItemSnap?.sr_no, 10);
            const srB = parseInt(b?.rowData?.ItemSnap?.sr_no, 10);
            return srA - srB;
        });
    }

    const handleNext = () => {
        const sortedItems = sortItems(assignList.current);
        POData.current.ItemsDetails = sortedItems;
        const tempPageData = { ...pageData, activeStep: 2 }
        setPageData(tempPageData)
    }

    const handleBack = () => {
        POData.current.ItemsDetails = assignList.current
        const tempPageData = { ...pageData, activeStep: 0 }
        setPageData(tempPageData)
    }

    const saveData = () => {
        POData.current.ItemsDetails = assignList.current
    }

    const updateData = () => {
        setSaving(true)
        saveData()
    }

    const tablePageHandler = (pageNumber) => {
        const tempFilterData = { ...filterData, page: pageNumber }
        setFilterData(tempFilterData)
    }

    const handleClickOpen = (data, index) => {
        setRowData(data)
        setSelectedId(index)
        setOpen(true)
    }
    // item assign handling
    const updateDataTable = (data) => {
        const tempTableData = [...tableData]
        tableData[selectedId] = data
        setTableData(tempTableData)
        handleClose()
    }

    const handleClose = () => {
        setOpen(false)
    }

    const searchHandler = async (search) => {
        if (search.length > 2) {
            let res = await PreProcumentService.getSingleOrderLists({ order_list_id: pageData.orderId, sr_no: search });
            const { data } = res.data.view
            setItemList(data)
        }
    }

    const searchData = async () => {
        if (srNo) {
            setDataIsLoading(true);
            PreProcumentService.getSingleOrderLists({ ...filterData, search: srNo })
                .then((result) => {
                    const { data, totalItems } = result.data.view
                    // check whether item is assing
                    const tempData = data.map((res) => {
                        if (assignList.current.length !== 0) {

                            let tempItemData = assignList.current.find((rs) => rs.rowData.id === res.id)
                            if (tempItemData) {
                                return { ...res, assing: true }
                            }

                        }
                        return { ...res, assing: false }
                    })

                    setNoOfData(totalItems)
                    setTableData(tempData)
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
        }
    }

    const resetItemData = async () => {
        setDataIsLoading(true)

        // SchedulesServices.getScheduleOrderList(params)
        PreProcumentService.getSingleOrderLists(filterData)
            .then((result) => {
                const { data, totalItems } = result.data.view
                // check whether item is assing
                const tempData = data.map((res) => {
                    if (assignList.current.length !== 0) {

                        let tempItemData = assignList.current.find((rs) => rs.rowData.id === res.id)
                        if (tempItemData) {
                            return { ...res, assing: true }
                        }

                    }
                    return { ...res, assing: false }
                })

                setNoOfData(totalItems)
                setTableData(tempData)
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
    }

    const tableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]
                    return (
                        <AcctionButton
                            status={data.assing}
                            disabled={pageData.isPosted || data?.allocated_quantity === data?.quantity}
                            onClick={() => pageData.isPosted || data?.allocated_quantity === data?.quantity ? null : handleClickOpen(data, dataIndex)}
                        />
                    )
                },
            },
        },
        {
            name: 'SR Number', // field name in the row object
            label: 'SR Number', // column title that will be shown in table
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.ItemSnap?.sr_no
                    return <p>{data}</p>
                },
            },
        },
        {
            name: 'SR Description',
            label: 'SR Description',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data =
                        tableData[dataIndex]?.ItemSnap?.medium_description
                    return <p>{data}</p>
                },
            },
        },

        {
            name: 'Schedule Date',
            label: 'Schedule Date',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.order_date_to
                    return <p>{dateParse(data)}</p>
                },
            },
        },
        {
            name: 'Order Qunatity',
            label: 'Order Qunatity',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.quantity
                    return <p>{data}</p>
                },
            },
        },
        {
            name: 'Allocated Qunatity',
            label: 'Allocated Qunatity',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.allocated_quantity
                    return <p>{data}</p>
                },
            },
        },
        {
            name: 'Status',
            label: 'Status',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.status
                    return <p>{data}</p>
                },
            },
        },
    ]

    return (
        <MainContainer>
            <Grid container spacing={2}>
                {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updateData}
                    >
                        save
                    </Button>
                </Grid> */}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ValidatorForm>
                        <FormControl className="w-full">
                            <SubTitle title="Item SR Number" />
                            <Autocomplete
                                disableClearable={false}
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={itemList}
                                value={item ? item : null}
                                onChange={(event, value) => {
                                    setSrNo(value ? value?.ItemSnap?.sr_no : null)
                                    setItem(value)
                                }}
                                getOptionSelected={(option, value) =>
                                    option.label === value?.ItemSnap?.sr_no
                                }
                                getOptionLabel={(option) => option?.ItemSnap?.sr_no}
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Item SR Number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={item ? item?.ItemSnap?.sr_no : ''}
                                        onChange={(event) => {
                                            searchHandler(event.target.value)
                                        }}
                                    // InputProps={{
                                    //     endAdornment: (
                                    //         <InputAdornment position="end">
                                    //             <IconButton onClick={() => searchData()}>
                                    //                 <SearchIcon></SearchIcon>
                                    //             </IconButton>
                                    //         </InputAdornment>
                                    //     ),
                                    // }}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>
                    </ValidatorForm>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
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
                                    style={{ backgroundColor: "#4BB543" }}
                                    variant="contained"
                                    onClick={searchData}
                                    startIcon={<SearchIcon />}
                                >
                                    Search
                                </Button>
                            </FormControl>
                            <FormControl className='px-2 py-2'>
                                <Button
                                    style={{ backgroundColor: "#DC3545" }}
                                    variant="contained"
                                    onClick={resetItemData}
                                    startIcon={<LayersClearIcon />}
                                >
                                    Reset
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {!dataIsLoading && (
                        <LoonsTable
                            id={'orderList'}
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
                        <div className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </div>
                    )}
                </Grid>
                <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    {!dataIsLoading &&
                        <Grid container spacing={2} className='my-5'>
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className=" w-full flex justify-end"
                            >
                                {/* Submit Button */}
                                <Button
                                    className='mr-2 mt-2'
                                    variant="contained"
                                    // color="primary"
                                    style={{
                                        backgroundColor: "#ff0e0e"
                                    }}
                                    startIcon='chevron_left'
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <Button
                                    className='mt-2'
                                    variant="contained"
                                    // color="primary"
                                    endIcon="chevron_right"
                                    onClick={handleNext}
                                    style={{
                                        backgroundColor: "#4BB543"
                                    }}
                                >
                                    Save & Next
                                </Button>
                            </Grid>
                        </Grid>}
                </Grid>
                {/* <Grid
                    item
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                    >
                        Save & Next
                    </Button>
                </Grid> */}
            </Grid>
            <Dialog fullWidth="fullWidth" maxWidth="xl" open={open}>
                <DialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                    <CardTitle title="Add Item Details" />
                    <IconButton aria-label="close" className={classes.closeButton}
                        onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {/* <DialogTitle style={{ borderBottom: '1px solid #000' }}>
                    <div
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            display: 'flex',
                            padding: 3,
                            cursor: 'pointer',
                        }}
                        onClick={handleClose}
                    >
                        <CloseIcon
                            style={{ color: 'white', width: 14, height: 14 }}
                        />
                    </div>
                </DialogTitle> */}

                <DialogContent>
                    <AssignItem
                        rowData={rowData}
                        assignList={assignList}
                        updateDataTable={updateDataTable}
                        handleClose={handleClose}
                        POType={POData.current.intend?.POType}
                    />
                </DialogContent>
            </Dialog>

            <LoonsSnackbar
                open={saving}
                onClose={() => {
                    setSaving(false)
                }}
                message="Data Saved"
                autoHideDuration={1200}
                severity='success'
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </MainContainer>
    )
}
