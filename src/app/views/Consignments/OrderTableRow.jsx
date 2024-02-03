import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import HoverableText from 'app/components/HoverableText';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';

import { Button, Tooltip } from '@material-ui/core';
import { useState } from 'react';
import { TextField } from '@material-ui/core';
import { ButtonGroup, Divider } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';


const classes = {
    row: {
        minHeight: '4em',
        marginTop: 1,
        marginBottomn: 1,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #eaeaea',
        borderRight: '1px solid #eaeaea',
    },
    rowEven: {
        background: '#f8f8f8',
        minHeight: '4em',
        marginTop: 1,
        marginBottomn: 1,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #eaeaea',
        borderRight: '1px solid #eaeaea',
    },
    min: {
        width: 'calc(5%)',
    },
    medium: {
        width: 'calc(10%)'
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'start'
    },
    max: {
        width: 'calc(35%)'
    },
    even: {
        width: 'calc(25%)'
    },
    btn: {
        padding: 0,
        width: '2em',
        height: '2em',
        minWidth: 0,
        margin: 1
    },
    hovered: {
        border: '1px solid #ffbdbd'
    }
}

const OrderTableRow = (props) => {
    const { data } = props
    // const classes = useStyles;
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleChange = (event, index) => {
        const newRows = [...rows];
        if (event.target.value) {
            newRows[index].schedules.quantity = String(parseInt(event.target.value, 10));
        } else {
            newRows[index].schedules.quantity = String(0)
        }
        setRows(newRows);
    };

    const handleAddRow = () => {
        console.log(data[0]?.sr_no, data[0]?.name, data[0]?.strength)
        setRows([...rows, { id: data[0]?.id, sr_no: data[0]?.sr_no ? data[0]?.sr_no : "Not Available", name: data[0]?.name ? data[0]?.name : "Not Available", strength: data[0]?.strength ? data[0]?.strength : "Not Available", schedules: { quantity: '0' } }]);
    };

    const handleRemoveRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleEditRow = (index) => {
        setSelectedRow(index);
    };

    const handleCancelEditRow = () => {
        setSelectedRow(null);
    };

    const handleSaveRow = (index) => {
        setSelectedRow(null);
    };

    useEffect(() => {
        setRows(data)
        console.log("Data: ", data)
    }, [])

    return (
        <div>
            <Typography variant='h6'>Schedule Details</Typography>
            <Divider className="mt-2 mb-2" />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SR No</TableCell>
                            <TableCell>SR Description</TableCell>
                            <TableCell>Strength</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? classes.rowEven : classes.row}>
                                <TableCell>
                                    <span>{row.sr_no ? row.sr_no : "Not Available"}</span>
                                </TableCell>
                                <TableCell>
                                    <span>{row.name ? row.name : "Not Available"}</span>
                                </TableCell>
                                <TableCell>
                                    <span>{row.strength ? row.strength : "Not Available"}</span>
                                </TableCell>
                                <TableCell>
                                    {selectedRow === index ? (
                                        <ValidatorForm>
                                            <TextValidator
                                                // key={this.state.key}
                                                className=" w-full"
                                                placeholder="Quantity"
                                                name="quantity"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={String(row?.schedules.quantity)}
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                min={0}
                                                onChange={(event) => handleChange(event, index)}
                                                validators={
                                                    ['minNumber:' + 0, 'required:' + true]}
                                                errorMessages={[
                                                    'Quantity Should be > 0',
                                                    'this field is required'
                                                ]}
                                            />
                                        </ValidatorForm>
                                    ) : (
                                        <span>{row?.schedules.quantity}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedRow === index ? (
                                        <ButtonGroup>
                                            <Button variant="contained" color="primary" size="small" onClick={() => handleSaveRow(index)}>
                                                <SaveIcon />
                                            </Button>
                                            <Button className={classes.btn} variant="contained" size="small" onClick={() => handleCancelEditRow()}>
                                                <ClearIcon fontSize="small" />
                                            </Button>
                                        </ButtonGroup>
                                    ) : (
                                        <ButtonGroup>
                                            <Button className={classes.btn} variant="contained" color="primary" size="small" onClick={() => handleEditRow(index)}>
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            <Button className={classes.btn} variant="contained" color="secondary" size="small" onClick={() => handleRemoveRow(index)}>
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button variant="contained" color="primary" onClick={() => handleAddRow()}>
                    Add Row
                </Button>
            </div>
        </div>
    );
};

export default OrderTableRow;
