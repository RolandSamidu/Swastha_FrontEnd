import React from 'react';
import { withStyles } from '@material-ui/styles';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Button, Grid, Popover } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useEffect } from 'react';
import { DatePicker, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import moment from 'moment';
import { Snackbar } from '@material-ui/core';
import Rating from '@mui/material/Rating';
import InventoryService from 'app/services/InventoryService';
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import { roundDecimal } from 'utils'

const styles = {
    footerContainer: {
        border: '1px solid #eaeaea',
        borderTop: 0,
        fontWeight: 'bold',
        color: '#c6c6c6',
        background: '#f8f8f8',
        paddingTop: 10,
        paddingBottom: 10,
    },
    tbleFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
    },
    min: {
        width: 'calc(5%)',
    },
    medium: {
        width: 'calc(10%)',
        textAlign: "center"
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'start'
    },
    max: {
        width: 'calc(25%)'
    },
    btn: {
        padding: 0,
        width: '2em',
        height: '2em',
        minWidth: 0,
        margin: 1
    },
}

const AddInput = ({ options, getOptionLabel = option => option, onChange = (e) => e, val = "", solo = false, text = "Add", tail = null }) => (
    <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        id="disable-clearable"
        freeSolo={solo}
        onChange={onChange}
        value={val}
        size='small'
        renderInput={(params) => (
            <div ref={params.InputProps.ref} style={{ display: 'flex' }}>
                <input type="text" {...params.inputProps}
                    style={
                        !tail ? { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                            : { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
                    }
                    placeholder={`⊕ ${text}`}
                    onChange={onChange}
                    value={val}
                />
                {tail ? <div style={{ display: 'flex', alignItems: 'center', background: 'white', margin: '1% 1% 1% 0', marginLeft: 0, border: '1px solid #e5e7eb', borderRadius: '0 5px 5px 0', padding: '1px' }}>{tail}</div> : null}
            </div>
        )}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <div style={{ display: 'flex' }}>
        <input type={type}
            style={
                !tail ? { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                    : { width: '98%', margin: '1%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
            }
            placeholder={`⊕ ${text}`}
            onChange={onChange}
            value={val}
        />
        {tail ? <div style={{ display: 'flex', alignItems: 'center', background: 'white', margin: '1% 1% 1% 0', marginLeft: 0, border: '1px solid #e5e7eb', borderRadius: '0 5px 5px 0', padding: '1px' }}>{tail}</div> : null}
    </div>
)

const AddRadioInput = ({ onChange = (e) => e, val = false }) => (
    <div style={{ display: 'flex' }}>
        <label style={{ marginRight: '10px' }}>
            <input
                type="radio"
                onChange={onChange}
                value={true}
                checked={val === true}
            />
            Yes
        </label>
        <label>
            <input
                type="radio"
                onChange={onChange}
                value={false}
                checked={val === false}
            />
            No
        </label>
    </div>
);

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null }) => (
    <DatePicker
        sx={
            !tail ? { width: '98%', margin: '2%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: 5 }
                : { width: '98%', margin: '2%', padding: '10px 5px', border: '1px solid #e5e7eb', borderRadius: '5px 0 0 5px', marginRight: 0, borderRight: 0 }
        }
        size='small'
        design={true}
        className='w-full'
        minDate={new Date()}
        value={val}
        format='dd/MM/yyyy'
        placeholder={`⊕ ${text}`}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const TableFoot = (props) => {
    const { classes, index, drugList, setDrugList, selectedDrug, select } = props;
    const [open, setOpen] = useState(false);

    const [supplier, setSupplier] = useState(null);

    const [suppliers, setSuppliers] = useState([]);
    const [supplierID, setSupplierID] = useState(null);

    const [condition1, setCondition1] = useState(false);
    const [condition2, setCondition2] = useState(false);
    const [condition3, setCondition3] = useState(false);

    const [price, setPrice] = useState(null)
    const [bond, setBond] = useState(null);

    const [comment, setComment] = useState(null);
    const [remark, setRemark] = useState(null);

    const clearField = () => {
        setSupplier(null);
        setSupplierID(null);
        setSuppliers([]);
        setCondition1(false);
        setCondition2(false);
        setCondition3(false);
        setPrice(null);
        setBond(null);
        setComment(null);
        setRemark(null)
    }

    useEffect(() => {
        if (supplier && supplier.length > 3) {
            HospitalConfigServices.getAllSuppliers({ search: supplier }).then((out) => {
                if (out.data) {
                    setSuppliers(out.data.view.data)
                }
            });
        }
    }, [supplier]);

    useEffect(() => {
        if (selectedDrug) {
            setSupplier(selectedDrug.supplier)
            setSupplierID(selectedDrug.supplierID)
            setCondition1(selectedDrug.condition1)
            setCondition2(selectedDrug.condition2)
            setCondition3(selectedDrug.condition3)
            setRemark(selectedDrug.remark);
            setComment(selectedDrug.comment);
            setPrice(selectedDrug.price)
            setBond(selectedDrug.bond)
        } else {
            clearField();
        }
    }, [selectedDrug]);

    return <div className={classes.footerContainer}>
        <div className={classes.tbleFooter}>
            <div className={classes.min}>&nbsp;</div>
            <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
            <div className={classes.max}>
                <AddInput options={suppliers ? suppliers : []} getOptionLabel={(option) => option.name || ""} text="Supplier" val={supplier ? supplier : ""} onChange={(e, val) => {
                    setSupplier(e.target.textContent ? e.target.textContent : e.target.value);
                    setSupplierID(val ? val.id : null);
                }} />
            </div>
            <div className={classes.medium}>
                <AddRadioInput val={condition1} onChange={(e) => {
                    setCondition1(e.target.value === 'true' ? true : false);
                }} />
            </div>
            <div className={classes.medium}>
                <AddRadioInput val={condition2} onChange={(e) => {
                    setCondition2(e.target.value === "true" ? true : false);
                }} />
            </div>
            <div className={classes.medium}>
                <AddRadioInput val={condition3} onChange={(e) => {
                    setCondition3(e.target.value === 'true' ? true : false);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Price (Rs)" type='number' val={price ? price : 0} onChange={(e) => {
                    setPrice(e.target.value > 0 ? roundDecimal(parseFloat(e.target.value), 2) : null);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Bid Bond" val={bond ? bond : ""} onChange={(e) => {
                    setBond(e.target.textContent ? e.target.textContent : e.target.value);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Comment" val={comment ? comment : ""} onChange={(e) => {
                    setComment(e.target.textContent ? e.target.textContent : e.target.value);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Remark" val={remark ? remark : ""} onChange={(e) => {
                    setRemark(e.target.textContent ? e.target.textContent : e.target.value);
                }} />
            </div>
            <div className={classes.medium}>
                <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                    onClick={() => {
                        const arr = [...drugList];
                        if (selectedDrug !== null) {
                            arr[index].supplierID = supplierID
                            arr[index].supplier = supplier;
                            arr[index].condition1 = condition1;
                            arr[index].condition2 = condition2;
                            arr[index].condition3 = condition3;
                            arr[index].price = price;
                            arr[index].remark = remark;
                            arr[index].bond = bond;
                            arr[index].comment = comment
                        }
                        else {
                            if (supplierID !== null && supplier !== null && condition1 !== null && condition2 !== null && condition3 !== null && price !== null && comment !== null && remark !== null && remark !== null && bond !== null) {
                                arr.push({ supplierID: supplierID, supplier: supplier, condition1: condition1, condition2: condition2, condition3: condition3, remark: remark, price: price, bond: bond, comment: comment });
                            } else {
                                setOpen(true)
                            }
                        }
                        setDrugList(arr);
                        clearField();
                        select(null);
                    }}>
                    <SaveOutlinedIcon />
                </Button>
            </div>
        </div>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={1200}
            onClose={() => setOpen(false)}
        >
            <Alert
                onClose={() => setOpen(false)}
                severity={'warning'}
                sx={{ width: '100%' }}
            >
                Please Fill Out the Fields
            </Alert>
        </Snackbar>
    </div>
}

TableFoot.propTypes = {
}

export default withStyles(styles)(TableFoot);