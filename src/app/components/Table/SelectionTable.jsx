import * as React from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import { Button } from '@mui/material'
import ModalLG from '../Modals/ModalLG'
import { Grid } from '@mui/material'
import localStorageService from 'app/services/localStorageService'
import FinanceServices from 'app/services/FinanceServices'
import { LoonsSnackbar } from '../LoonsLabComponents'

function createData(voteCode, description, status, amount) {
    return {
        voteCode,
        description,
        status,
        amount,
    }
}

const rows = [
    createData(
        'VT-5043',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam congue.',
        'Null',
        '2000'
    ),
    createData(
        'VT-5034',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam congue.',
        'Null',
        '2000'
    ),
    createData(
        'VT-5052',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam congue.',
        'Null',
        '2000'
    ),
]

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

const headCells = [
    {
        id: 'voteCode',
        numeric: false,
        disablePadding: true,
        label: 'Vote Code',
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: true,
        label: 'Description',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: 'Status',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: true,
        label: 'Amount',
    },
    {
        id: 'remaining_amount',
        numeric: false,
        disablePadding: true,
        label: 'Remaining Amount',
    }
]

function EnhancedTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        style={{ display: 'none' }}
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}
const renderDetailCard = (label, value) => {
    return (
        <Grid
            container
            alignItems={'center'}
            sx={{ minHeight: '40px' }}
            spacing={0}
        >
            <Grid item xs={5}>
                {label}
            </Grid>
            <Grid item xs={1}>
                :
            </Grid>
            <Grid item xs={6}>
                {value}
            </Grid>
        </Grid>
    )
}

function EnhancedTableToolbar(props) {
    const { numSelected, data } = props
    const [snackBar, setSnackBar] = React.useState({
        severity: 'success',
        alert: false,
        message: ''
    })

    const handleParentData = (data) => {
        props.callback(data)
        props.setVotesView(false)
        console.log("Parent Data", data);
    };

    const handleClick = async () => {
        handleParentData(data)
        /*      let res = await FinanceServices.createFinanceVouchers(data)
             if (res.status === 201) {
                 setSnackBar({
                     alert: true,
                     message: "Voucher has been Created Successfully",
                     severity: 'success'
                 })
                 handleParentData(data)
             } else {
                 setSnackBar({
                     alert: true,
                     message: "Failed to Create Voucher",
                     severity: 'error'
                 })
             } */
        // handleParentData(data)
    }
    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                {numSelected > 0 && (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                )}

                {numSelected > 0 && (

                    <div>

                        <Button variant="contained" onClick={() => handleClick()}>Proceed</Button>
                    </div>
                    
                    
                )}
            </Toolbar>
            <LoonsSnackbar
                open={snackBar.alert}
                onClose={() => {
                    setSnackBar({ ...snackBar, alert: false })
                }}
                message={snackBar.message}
                autoHideDuration={3000}
                severity={snackBar.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </>
    )
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
}

export default function SelectionTable({ consingmentData,selectionDisabled, data, other, creditNoteAmount, remark, setVotesView, callback }) {
    const [order, setOrder] = React.useState('asc')
    const [orderBy, setOrderBy] = React.useState('code')
    const [selected, setSelected] = React.useState([])
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(false)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [values, setValues] = React.useState({
        "code": null,
        "amount": null,
        "generated_by": null,
        "payee": null,
        "votes_id": null,
        "sa_status": "Created",
        "sa_remark": null,
        "sa_action_by": null,
        "po_no": null,
        "order_list_no": null,
        "document_id": null,
    })

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected = []

        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, name)
        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1))
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1))
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(
        //         selected.slice(0, selectedIndex),
        //         selected.slice(selectedIndex + 1)
        //     )
        // }

        // Only one Element can be clicked
        if (selectedIndex === -1) {
            // if item not already selected, select it
            newSelected = [id];
        } else {
            // if only one item is selected and it's the same as the clicked item, deselect it
            newSelected = [];
        }

        const item = data.find(item => item.id === id);

        setSelected(newSelected)
        setValues({ ...values, votes_id: id, amount: item.amount, code: item.code })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleChangeDense = (event) => {
        setDense(event.target.checked)
    }

    const isSelected = (name) => selected.indexOf(name) !== -1

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0


    const setingInitialVal = async () => {
        var user = await localStorageService.getItem('userInfo');
        console.log("other data",other)
        console.log('consinement data',consingmentData)
        if (other) {
            setValues({
                ...values,
                sa_remark: remark,
                remark: remark,
                credit_note_amount: creditNoteAmount ? creditNoteAmount : 0,
                document_id: other.document_id,
                generated_by: user.id,
                payee: other.payee_id,
                order_list_no: other.data.order_list_no,
                po_no: other.data.po,
                sa_status: other.status,
                sa_action_by: user.id,
                consingmentData:consingmentData
            })
        }
    }

    React.useEffect(() => {
        //var user = await localStorageService.getItem('userInfo');
        //console.log('user', user)
        //var id = user.id;
        setingInitialVal()
    }, [])
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            selectionDisabled={selectionDisabled}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(
                                        row.id
                                    )
                                    const labelId = `enhanced-table-checkbox-${index}`

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(event, row.id)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.code}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    style={{
                                                        display: `${selectionDisabled
                                                            ? 'none'
                                                            : 'block'
                                                            }`,
                                                    }}
                                                    inputProps={{
                                                        'aria-labelledby':
                                                            labelId,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.code ? row.code : 'Not Available'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.description ? row.description : 'Not Available'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.status ? row.status : 'Not Available'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.amount ? row.amount : 'Not Available'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {selected.length > 0 && (
                    <EnhancedTableToolbar numSelected={selected.length} data={values} setVotesView={setVotesView} callback={callback} />
                )}
            </Paper>
        </Box>
    )
}
