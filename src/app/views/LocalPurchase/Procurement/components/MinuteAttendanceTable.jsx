import React, { useState } from "react";
import { styled } from "@material-ui/core";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    TableContainer,
    Typography,
} from "@material-ui/core";
import { tableCellClasses } from '@mui/material/TableCell';
import AddIcon from "@material-ui/icons/Add";
import { LoonsSnackbar } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const MinuteAttendanceTable = () => {
    const [columns, setColumns] = useState(['']);
    const [snackbar, setSnackbar] = useState({ alert: false, message: '', severity: "success" })
    const [data, setData] = useState([{
        isSealed: null,
        isValid: null,
        isNone: null,
        price: null,
        comment: null,
        remark: null,
    }])

    const [rows, setRows] = useState([
        "Sealed",
        'isValid',
        'isNone',
        'price',
        'comment',
        'remark',
    ])


    const handleAddColumn = () => {
        const lastRow = data[data.length - 1];
        const isLastRowEmpty = Object.values(lastRow).every((field) => field === null || field === '');

        if (!isLastRowEmpty) {
            // Add a new column
            setColumns((prevColumns) => [...prevColumns, '']);
            setData((prevData) => [
                ...prevData,
                {
                    isSealed: null,
                    isValid: null,
                    isNone: null,
                    price: null,
                    comment: null,
                    remark: null,
                },
            ]);
        } else {
            setSnackbar({ message: "Please fill out the previous values", alert: true, severity: "error" })
        }
    };

    const handleChange = (columnIndex, rowIndex, value) => {
        // const updatedColumns = [...columns];
        // updatedColumns[columnIndex][rowIndex] = value;
        // setColumns(updatedColumns);
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[columnIndex][rows[rowIndex]] = value;
            return updatedData;
        });
    };

    return (
        <div style={{ overflowX: "auto" }}>
            <ValidatorForm>
                <TableContainer className="mb-5" style={{ backgroundColor: "#fff" }}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ minWidth: "200px" }}>Observation Criteria</StyledTableCell>
                                {columns.map((_, columnIndex) => (
                                    <StyledTableCell key={columnIndex} style={{ minWidth: "200px" }}>Column {columnIndex + 1}</StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* <TableRow>
                    <TableCell>Hello</TableCell>
                </TableRow> */}
                            {rows.map((rowHeading, rowIndex) => (
                                <StyledTableRow key={rowIndex}>
                                    <StyledTableCell style={{ minWidth: "200px" }}>
                                        <Typography>{rowHeading}</Typography>
                                    </StyledTableCell>
                                    {columns.map((_, columnIndex) => (
                                        <StyledTableCell key={columnIndex} style={{ minWidth: "200px" }}>
                                            <TextValidator
                                                className="w-full"
                                                placeholder={`Column ${columnIndex + 1}`}
                                                name="sr_no"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={data[columnIndex][rows[rowIndex]]}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    handleChange(columnIndex, rowIndex, e.target.value)
                                                }}
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />
                                            {/* <TextField
                                            // disabled={c}
                                            value={data[columnIndex][rows[rowIndex]]}
                                            onChange={(e) =>
                                                handleChange(columnIndex, rowIndex, e.target.value)
                                            }
                                            fullWidth
                                            placeholder={`Column ${columnIndex + 1}`}
                                        /> */}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <TableBody>
                            <TableRow>
                                <TableCell align="right" colSpan={columns.length + 1}>
                                    <IconButton onClick={handleAddColumn}>
                                        <AddIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </ValidatorForm>
            <LoonsSnackbar
                open={snackbar.alert}
                onClose={() => {
                    setSnackbar({ ...snackbar, alert: false })
                }}
                message={snackbar.message}
                autoHideDuration={1200}
                severity={snackbar.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </div>
    );
};

export default MinuteAttendanceTable;