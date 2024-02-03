import React from 'react';
import { withStyles } from '@material-ui/styles';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Button, Grid, Popover, Typography } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useEffect } from 'react';
import { DatePicker, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import moment from 'moment';
import { Snackbar } from '@material-ui/core';
import InventoryService from 'app/services/InventoryService';
import { roundDecimal } from 'utils';

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
        width: 'calc(60%/6)',
        textAlign: "center"
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'start'
    },
    max: {
        width: 'calc(30%)'
    },
    btn: {
        padding: 0,
        width: '2em',
        height: '2em',
        minWidth: 0,
        margin: 1
    },
}

const AddInput = ({ options, getOptionLabel = (option) => option, onChange = (e) => e, val = "", solo = false, text = "Add", tail = null }) => (
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

const TableFoot = (props) => {
    const { classes, index, drugList, setDrugList, selectedDrug, select } = props;
    const [open, setOpen] = useState(false);

    const [srNo, setSrNo] = useState(null);
    const [itemName, setItemName] = useState(null);

    const [orderQuantity, setOrderQuantity] = useState(null);
    const [transitQuantity, setTransitQuantity] = useState(null);
    const [per, setPer] = useState(null);
    const [price, setPrice] = useState(null);

    const [drugs, setDrugs] = useState([]);
    const [drugID, setDrugID] = useState([]);

    const clearField = () => {
        setSrNo(null);
        setItemName(null);
        setDrugs(null);
        setDrugID(null);
        setOrderQuantity(null);
        setTransitQuantity(null);
        setPer(null);
        setPrice(0);
    }

    useEffect(() => {
        if (itemName && itemName.length > 3) {
            InventoryService.fetchAllItems({ search: itemName, is_prescrible: "true" }).then((out) => {
                if (out.data) {
                    const drugItems = out.data.view.data.map((item) => {
                        return {
                            title: item.medium_description,
                            uom: item.ItemUOM ? item.ItemUOM.UOM.name : "mg",
                            id: item.id,
                            sr_no: item.sr_no,
                            strength: item.item_unit_size.replace(/[.,]00$/, ""),
                            route: item.DefaultRoute ? item.DefaultRoute.name : "",
                            frequency: item.DefaultFrequency ? item.DefaultFrequency.name : "",
                            frequency_id: item.DefaultFrequency ? item.DefaultFrequency.id : "",
                            frequency_val: item.DefaultFrequency ? item.DefaultFrequency.value : "",
                            duration: item.default_duration
                            // TODO:
                        }
                    });
                    setDrugs(drugItems)
                }
            });
        }
    }, [itemName]);

    useEffect(() => {
        if (srNo && srNo.length > 3) {
            InventoryService.fetchAllItems({ search: srNo, is_prescrible: "true" }).then((out) => {
                if (out.data) {
                    const drugItems = out.data.view.data.map((item) => {
                        return {
                            title: item.medium_description,
                            uom: item.ItemUOM ? item.ItemUOM.UOM.name : "mg",
                            id: item.id,
                            sr_no: item.sr_no,
                            strength: item.item_unit_size.replace(/[.,]00$/, ""),
                            route: item.DefaultRoute ? item.DefaultRoute.name : "",
                            frequency: item.DefaultFrequency ? item.DefaultFrequency.name : "",
                            frequency_id: item.DefaultFrequency ? item.DefaultFrequency.id : "",
                            frequency_val: item.DefaultFrequency ? item.DefaultFrequency.value : "",
                            duration: item.default_duration
                            // TODO:
                        }
                    });
                    setDrugs(drugItems)
                }
            });
        }
    }, [srNo]);

    useEffect(() => {
        if (selectedDrug) {
            setSrNo(selectedDrug.srNo);
            setDrugID(selectedDrug.drugID);
            setItemName(selectedDrug.itemName);
            setOrderQuantity(selectedDrug.orderQuantity);
            setTransitQuantity(selectedDrug.transitQuantity);
            setPer(selectedDrug.per)
            setPrice(selectedDrug.price);
        } else {
            clearField()
        }
    }, [selectedDrug]);

    return <div className={classes.footerContainer}>
        <div className={classes.tbleFooter}>
            <div className={classes.min}>&nbsp;</div>
            <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
            <div className={classes.medMax}>
                <AddInput options={drugs ? drugs : []} getOptionLabel={(option) => option.sr_no || ""} text="SR No" val={srNo ? srNo : ""} onChange={(e, val) => {
                    setSrNo(e.target.textContent ? e.target.textContent : e.target.value);
                    setDrugID(val ? val.id : null);
                    setItemName(val ? val.title : null);
                }} />
            </div>
            <div className={classes.medMax}>
                <AddInput options={drugs ? drugs : []} getOptionLabel={(option) => option.title || ""} text="Item Name" val={itemName ? itemName : ""} onChange={(e, val) => {
                    setItemName(e.target.textContent ? e.target.textContent : e.target.value);
                    setDrugID(val ? val.id : null);
                    setSrNo(val ? val.sr_no : null);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Order Quantity" type='number' val={orderQuantity ? orderQuantity : 0} onChange={(e) => {
                    console.log("Value :", e.target.value)
                    setOrderQuantity(e.target.value > 0 ? roundDecimal(parseFloat(e.target.value), 2) : null);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Per" type='number' val={per ? per : 0} onChange={(e) => {
                    console.log("Value :", e.target.value)
                    setPer(e.target.value > 0 ? roundDecimal(parseFloat(e.target.value), 2) : null);
                }} />
            </div>
            {/* <div className={classes.medMax}>
                <AddInput options={[]} text="Dosser No" val={dosserNo} tail={'mg'} onChange={(e) => {
                    setDosserNo(e.target.textContent ? e.target.textContent : e.target.value);
                }} />
            </div> */}
            <div className={classes.medium}>
                <AddTextInput text="MQP (Rs)" type='number' val={price ? price : 0} onChange={(e) => {
                    console.log("Value :", e.target.value)
                    setPrice(e.target.value > 0 ? roundDecimal(parseFloat(e.target.value), 2) : null);
                }} />
            </div>
            <div className={classes.medium}>
                <AddTextInput text="Transit Quantity" type='number' val={transitQuantity ? transitQuantity : 0} onChange={(e) => {
                    console.log("Value :", e.target.value)
                    setTransitQuantity(e.target.value > 0 ? roundDecimal(parseFloat(e.target.value), 2) : null);
                }} />
            </div>
            <div className={classes.medium}>
                <Typography>{orderQuantity ? transitQuantity ? orderQuantity - transitQuantity : orderQuantity : 0}</Typography>
            </div>
            <div className={classes.medium}>
                <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                    onClick={() => {
                        const arr = [...drugList];
                        if (selectedDrug !== null) {
                            arr[index].drugID = drugID
                            arr[index].srNo = srNo;
                            arr[index].itemName = itemName;
                            arr[index].orderQuantity = orderQuantity;
                            arr[index].transitQuantity = transitQuantity;
                            arr[index].per = per;
                            arr[index].price = price;
                        }
                        else {
                            if (srNo !== null && itemName !== null && drugID !== null && orderQuantity !== null && transitQuantity !== null && per !== null && price !== null) {
                                arr.push({ drugID: drugID, srNo: srNo, itemName: itemName, orderQuantity: orderQuantity, per: per, transitQuantity: transitQuantity, price: price });
                            } else {
                                setOpen(true);
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