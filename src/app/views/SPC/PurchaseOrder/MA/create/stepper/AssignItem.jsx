import React, { useState, useEffect, useMemo } from 'react'
import Button from '@material-ui/core/Button'
import {
    Grid,
    FormControl,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@material-ui/core'
import {
    MainContainer,
    SubTitle,
    DatePicker,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import Divider from '@material-ui/core/Divider'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import EditIcon from '@material-ui/icons/Edit'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { dateParse, convertTocommaSeparated } from 'utils'
import * as appConst from 'appconst'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import RichTextEditor from 'react-rte'
import SaveIcon from '@mui/icons-material/Save';
import { isInteger, isNull, isUndefined } from 'lodash'
import InventoryService from 'app/services/InventoryService'
import SPCServices from 'app/services/SPCServices'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

// const errorStyle = {
//     color: 'red',
//     fontSize: '14px',
// }

const selectedList = {
    deliveryLocation: [
        { loc: 'MSD' },
        { loc: 'Family Health Bureau' },
        { loc: 'National AIDS control' },
        { loc: 'Epidemiology' },
        { loc: 'NBTS' },
        { loc: 'MRI' },
        { loc: 'NMQAL' },
    ]
}

const DeliverySchedule = ({
    unitType,
    allocatedQuantity,
    POItemId,
    isEdit,
    deliverySchedule,
    setDeliverySchedule,
    orderQuantity,
    Add,
}) => {
    const [id, setId] = useState(null);
    const [isAdd, setIsAdd] = useState(true)
    const [sheduleDate, setSheduleDate] = useState(null)
    const [quantity, setQuantity] = useState(null)
    const [deliveryLocation, setDeliveryLocation] = useState('')
    const [updateIndex, setUpdateIndex] = useState(null)
    const [remainingQuantity, setRemainingQuantity] = useState(0)
    const [remark, setRemark] = useState('')
    const [snackbar, setSnackbar] = useState({ alert: false, severity: "success", message: "" })

    useEffect(() => {
        const calculateRemainingQuantity = async () => {
            let total = 0;

            for (let value of deliverySchedule) {
                if (value?.quantity) {
                    total += parseInt(value.quantity);
                }
            }

            // console.log("Initially Called: ", orderQuantity, total)
            if (deliverySchedule.length > 0 && (parseInt(orderQuantity) < total && parseInt(orderQuantity) > 0 || orderQuantity === "")) {
                if (isEdit) {
                    await removeDeliverySchedules();
                    setQuantity(orderQuantity > allocatedQuantity ? allocatedQuantity : orderQuantity);
                    setRemainingQuantity(orderQuantity > allocatedQuantity ? allocatedQuantity : orderQuantity);
                    setSnackbar({ alert: true, severity: "info", message: 'Removed Delivery Details Since Order Quantity is less' });
                } else if (isEdit === false) {
                    console.log(isEdit)
                    setSnackbar({ alert: true, severity: "success", message: "Sorry Delivery Schedules may vary" })

                } else {
                    setDeliverySchedule([]);
                }
            } else {
                setQuantity(orderQuantity > allocatedQuantity ? allocatedQuantity - total : orderQuantity - total);
                setRemainingQuantity(orderQuantity > allocatedQuantity ? allocatedQuantity - total : orderQuantity - total);
            }

        };

        calculateRemainingQuantity(); // Call the async function
    }, [orderQuantity])

    const removeDeliverySchedules = async () => {
        try {
            for (const item of deliverySchedule) {
                if (item?.id !== undefined && item?.id !== null) {
                    try {
                        await SPCServices.deleteSPCPODeliverySchedules(item.id);
                        // Update the deliverySchedule state by removing the deleted item
                        setDeliverySchedule(prevSchedule => prevSchedule.filter(scheduleItem => scheduleItem.id !== item.id));
                    } catch (error) {
                        // Delete failed
                        const errorMessage = `Error Code: ${error.code} Error Message: ${error.message}`;
                        setSnackbar({ alert: true, severity: "error", message: errorMessage });
                    }
                }
            }
        } catch (error) {
            // General error handling
            console.error("An error occurred:", error);
        }
    }

    useEffect(() => {
        let total = 0

        for (let value of deliverySchedule) {
            if (value?.quantity) {
                total += parseInt(value.quantity)
            }
        }
        let tempRemainingQuantity = parseInt(orderQuantity) - total

        // console.log('Remaining: ', orderQuantity, total)

        setQuantity(tempRemainingQuantity)
        setRemainingQuantity(tempRemainingQuantity)

    }, [deliverySchedule])

    const addSchedule = () => {
        if (Add) {
            setSnackbar({ alert: true, severity: "warning", message: "Sorry, Add/Edit Operation not Available" })
            return null
        }

        if (isNull(quantity) || parseFloat(quantity) === 0 || !isInteger(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
            setSnackbar({ alert: true, severity: "warning", message: "Invalid Quantity" })
            return null
        } else if (isNull(updateIndex) && parseFloat(quantity) > parseFloat(remainingQuantity)) {
            console.log("Data: ", quantity, remainingQuantity)
            setSnackbar({ alert: true, severity: "warning", message: "Cannot Allocate more than Ordered Quantity" })
            return null
        } else if (!isNull(updateIndex) && parseFloat(quantity) > parseFloat(remainingQuantity + deliverySchedule[updateIndex]?.quantity)) {
            setSnackbar({ alert: true, severity: "warning", message: "Cannot Allocate more than Ordered Quantity" })
            return null
        }

        if (isAdd) {
            if (isEdit && POItemId) {
                SPCServices.createSPCPODeliverySchedules({
                    "spc_po_item_id": POItemId,
                    "shedule_date": sheduleDate,
                    "delivery_location": deliveryLocation,
                    "quantity": quantity,
                    "remarks": remark
                }).then((res) => {
                    setSnackbar({ alert: true, severity: "success", message: "Delivery Schedule has been added" })
                    setDeliverySchedule((data) => [
                        ...data,
                        { id: res?.data?.posted?.res?.id, sheduleDate, deliveryLocation, quantity, remark },
                    ])
                }).catch(err => {
                    setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
                })
            } else if (isEdit === false) {
                setSnackbar({ alert: true, severity: "success", message: "Sorry Don't have permission to add" })
            } else {
                setSnackbar({ alert: true, severity: "success", message: "Delivery Schedule has been added" })
                setDeliverySchedule((data) => [
                    ...data,
                    { sheduleDate, deliveryLocation, quantity, remark },
                ])
            }
        } else {
            let tempList = [...deliverySchedule]
            tempList[updateIndex] = { ...tempList[updateIndex], sheduleDate, deliveryLocation, quantity, remark }
            setUpdateIndex(null)
            setIsAdd(true)

            if (isEdit && id) {
                SPCServices.changeSPCPODeliverySchedules(id, {
                    "shedule_date": sheduleDate,
                    "delivery_location": deliveryLocation,
                    "quantity": quantity,
                    "remarks": remark
                }).then((res) => {
                    setDeliverySchedule(tempList)
                    setSnackbar({ alert: true, severity: "success", message: "Delivery Schedule has been updated" })
                }).catch(err => {
                    setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
                })
            } else if (isEdit === false) {
                setSnackbar({ alert: true, severity: "success", message: "Sorry Don't have permission to update" })
            } else {
                setDeliverySchedule(tempList)
                setSnackbar({ alert: true, severity: "success", message: "Delivery Schedule has been updated" })
            }
        }
        setSheduleDate(null)
        setQuantity(null)
        setDeliveryLocation('')
        setRemark('')
    }

    const remove = (i) => {
        if (Add) {
            setSnackbar({ alert: true, severity: "warning", message: "Remove Sorry, Operation not Available" })
            return null
        }

        let temp = deliverySchedule.filter((element, index) => index !== i)
        let data = deliverySchedule[i]

        if (isEdit && data?.id) {
            SPCServices.deleteSPCPODeliverySchedules(data?.id).then(res => {
                setSnackbar({ alert: true, severity: "success", message: "Delivery Schedule has been removed" })
                setDeliverySchedule([...temp])
            }).catch(err => {
                setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
            })
        } else {
            setDeliverySchedule([...temp])
            setSnackbar({ alert: true, severity: "success", message: "Delivery Schedule has been removed" })
        }
    }

    const cancel = () => {
        setSheduleDate(null)
        setDeliveryLocation('')
        setUpdateIndex(null)
        setIsAdd(true)
        setQuantity('')
        setRemark('')
    }

    const update = (i) => {
        let data = deliverySchedule[i]

        setSheduleDate(data.sheduleDate)
        setQuantity(data.quantity)
        setDeliveryLocation(data.deliveryLocation)
        setRemark(data.remark)
        setUpdateIndex(i)

        if (isEdit) {
            setId(data.id)
        }
        setIsAdd(false)
        setRemainingQuantity(data.quantity)
    }

    return (
        <div style={{ padding: '1rem', width: '100%' }}>
            <Grid
                container
                spacing={2}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Grid item xs={2}>
                    <FormControl className="w-full">
                        <SubTitle title="Schedule Date" />
                        <DatePicker
                            disabled={isEdit === false}
                            className="w-full"
                            value={sheduleDate}
                            minDate={new Date()}
                            placeholder="Date From"
                            onChange={(date) => {
                                setSheduleDate(date || null);
                            }}
                        />
                        {/* <lable style={errorStyle}>error</lable> */}
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className="w-full">
                        <SubTitle
                            title={`Quantity`}
                        />
                        <TextField
                            disabled={isEdit === false}
                            value={quantity || ''}
                            onChange={(e) => setQuantity(e.target.value > 0 ? e.target.value : '')}
                            size="small"
                            variant="outlined"
                            type='number'
                            sx={{
                                '& legend': { display: 'none' },
                                '& fieldset': { top: 0 },
                            }}
                        />
                        {/* <lable style={errorStydata.datele}></lable> */}
                        <SubTitle
                            title={`(Ordered Qty. : ${orderQuantity})`}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl className="w-full">
                        <SubTitle
                            title={`Remark`}
                        />
                        <TextField
                            disabled={isEdit === false}
                            value={remark || ''}
                            onChange={(e) => setRemark(e.target.value)}
                            size="small"
                            variant="outlined"
                            sx={{
                                '& legend': { display: 'none' },
                                '& fieldset': { top: 0 },
                            }}
                        />
                        {/* <lable style={errorStydata.datele}></lable> */}
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl className="w-full">
                        <SubTitle title="Delivery Location" />
                        <Autocomplete
                            disabled={isEdit === false}
                            id="free-solo-demo"
                            freeSolo
                            options={selectedList.deliveryLocation.map((option) => option.loc)}
                            // onChange={(event, newValue) => {
                            //     setUOM(newValue);
                            // }}
                            inputValue={deliveryLocation}
                            onInputChange={(event, newInputValue) => {
                                setDeliveryLocation(newInputValue)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    disabled={isEdit === false}
                                    {...params}
                                    size="small"
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={deliveryLocation}
                                    variant="outlined"
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid
                    item
                    xs={2}
                    style={{
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', bottom: 0 }}>
                        <Tooltip title={!isAdd ? "Save" : "Add"}>
                            <IconButton disabled={isEdit === false} onClick={addSchedule}>
                                {!isAdd ?
                                    <SaveIcon style={{ color: '#03C988' }} /> :
                                    <AddCircleIcon style={{ color: '#03C988' }} />
                                }
                            </IconButton>
                        </Tooltip>
                        {!isAdd && (
                            <Tooltip title="Cancel Update">
                                <IconButton
                                    disabled={isEdit === false}
                                    aria-label="delete"
                                    onClick={cancel}
                                >
                                    <CancelIcon style={{ color: '#FF6464' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </Grid>

                <Grid item xs={12}>
                    {deliverySchedule.map((data, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    width: '60vw',
                                    margin: '0 auto',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Date</p>}
                                        <p>{data?.sheduleDate ? dateParse(data.sheduleDate) : 'N/A'}</p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Quantity</p>}
                                        <p>{data.quantity} {unitType}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Remark</p>}
                                        <p>{data?.remark ? data?.remark : "N/A"}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Location</p>}
                                        <p>{data?.deliveryLocation ? data?.deliveryLocation : "N/A"}</p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Action</p>}
                                        <Tooltip title="Remove form List">
                                            <IconButton
                                                disabled={isEdit === false}
                                                onClick={() => remove(index)}
                                            >
                                                <RemoveCircleIcon
                                                    style={{ color: '#F57328' }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Update">
                                            <IconButton
                                                disabled={isEdit === false}
                                                onClick={() => update(index)}
                                            >
                                                <EditIcon
                                                    style={{ color: '#00337C' }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </div>
                        )
                    })}
                </Grid>
            </Grid>
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
    )
}

const PackingDetails = ({ POItemId, packingDetails, setPackingDetails, isEdit, Add }) => {
    const [id, setId] = useState(null)
    const [isAdd, setIsAdd] = useState(true)
    const [packSize, setPackSize] = useState('')
    const [UOM, setUOM] = useState('')
    const [quantity, setQuantity] = useState('')
    const [conversion, setConversion] = useState('')
    const [minPackFactor, setMinPackFactor] = useState(false)
    const [storingLevel, setStoringLevel] = useState(false)
    const [snackbar, setSnackbar] = useState({ alert: false, severity: "success", message: "" })
    // const [open, setOpen] = useState(false)
    const [updateIndex, setUpdateIndex] = useState(null)

    const addSchedule = () => {
        if (Add) {
            setSnackbar({ alert: true, severity: "warning", message: "Sorry, Add/Edit Operation not Available" })
            return null
        }

        if (UOM === "" || packSize === '') {
            setSnackbar({ alert: true, severity: "warning", message: "Please provide some values" })
            return null
        } else if (packSize !== '' && !(isInteger(parseFloat(packSize)) && parseFloat(packSize) > 0)) {
            console.log("Type : ", typeof (packSize))
            setSnackbar({ alert: true, severity: "warning", message: "Pack Size Should be an (+) Integer" })
            return null
        } else if (conversion !== '' && !(isInteger(parseFloat(conversion)) && parseFloat(conversion) > 0)) {
            console.log("Type : ", typeof (conversion))
            setSnackbar({ alert: true, severity: "warning", message: "Conversion Should be an (+) Integer" })
            return null
        }

        if (isAdd) {
            if (isEdit && POItemId) {
                SPCServices.createSPCPOPackingDetails({
                    "spc_po_item_id": POItemId,
                    "pack_size": parseFloat(packSize),
                    "uom": UOM,
                    "quantity": parseInt(quantity, 10),
                    "conversion": parseFloat(conversion),
                    "min_pack_factor": minPackFactor,
                    "storing_level": storingLevel
                }).then((res) => {
                    setPackingDetails((data) => [
                        ...data,
                        {
                            id: res?.data?.posted?.res?.id,
                            packSize,
                            UOM,
                            quantity,
                            conversion,
                            minPackFactor,
                            storingLevel,
                        },
                    ])
                    setSnackbar({ alert: true, severity: "success", message: "Packing Details has been added" })
                }).catch(err => {
                    setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
                })
            } else if (isEdit === false) {
                setSnackbar({ alert: true, severity: "success", message: "Sorry Don't have permission to add" })
            } else {
                setPackingDetails((data) => [
                    ...data,
                    {
                        packSize,
                        UOM,
                        quantity,
                        conversion,
                        minPackFactor,
                        storingLevel,
                    },
                ])
                setSnackbar({ alert: true, severity: "success", message: "Packing Details has been added" })
            }
        } else {
            let tempList = [...packingDetails]
            tempList[updateIndex] = {
                packSize,
                UOM,
                quantity,
                conversion,
                minPackFactor,
                storingLevel,
            }
            setUpdateIndex(null)
            setIsAdd(true)

            if (isEdit && id) {
                SPCServices.changeSPCPOPackingDetails(id, {
                    "pack_size": parseFloat(packSize),
                    "uom": UOM,
                    "quantity": parseInt(quantity, 10),
                    "conversion": parseFloat(conversion),
                    "min_pack_factor": minPackFactor,
                    "storing_level": storingLevel
                }).then((res) => {
                    setPackingDetails(tempList)
                    setSnackbar({ alert: true, severity: "success", message: "Packing Details has been updated" })
                }).catch(err => {
                    setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
                })
            } else if (isEdit === false) {
                setSnackbar({ alert: true, severity: "success", message: "Sorry Don't have permission to update" })
            } else {
                setPackingDetails(tempList)
                setSnackbar({ alert: true, severity: "success", message: "Packing Details has been updated" })
            }
        }
        setPackSize('')
        setUOM('')
        setQuantity(0)
        setConversion('')
        setMinPackFactor(false)
        setStoringLevel(false)
    }

    const remove = (i) => {
        if (Add) {
            setSnackbar({ alert: true, severity: "warning", message: "Sorry, Delete Operation not Available" })
            return null
        }

        let temp = packingDetails.filter((element, index) => index !== i)
        let data = packingDetails[i]

        if (isEdit && data?.id) {
            SPCServices.deleteSPCPOPackingDetails(data?.id).then(res => {
                setSnackbar({ alert: true, severity: "success", message: "Packing Details has been removed" })
                setPackingDetails([...temp])
            }).catch(err => {
                setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
            })
        } else {
            setPackingDetails([...temp])
            setSnackbar({ alert: true, severity: "success", message: "Packing Details has been removed" })
        }
    }

    const cancel = () => {
        setIsAdd(true)
        setUpdateIndex(null)
        setPackSize('')
        setUOM('')
        setQuantity(0)
        setConversion('')
        setMinPackFactor(false)
        setStoringLevel(false)
    }

    const update = (i) => {
        let data = packingDetails[i]

        setPackSize(data.packSize)
        setUOM(data.UOM)
        setQuantity(data.quantity)
        setConversion(data.conversion)
        setMinPackFactor(data.minPackFactor)
        setStoringLevel(data.storingLevel)

        if (isEdit) {
            setId(data.id)
        }

        setUpdateIndex(i)
        setIsAdd(false)
    }

    return (
        <div style={{ padding: '1rem' }}>
            <Grid
                container
                spacing={2}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Grid item xs={2}>
                    <FormControl className="w-full">
                        <SubTitle title="Pack Size" />
                        <TextField
                            disabled={isEdit === false}
                            value={packSize || ''}
                            onChange={(e) => setPackSize(e.target.value > 0 ? e.target.value : '')}
                            size="small"
                            variant="outlined"
                            type='number'
                            sx={{
                                '& legend': { display: 'none' },
                                '& fieldset': { top: 0 },
                            }}
                        />
                        {/* <lable style={errorStyle}>error</lable> */}
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className="w-full">
                        <SubTitle title="UOM" />
                        <Autocomplete
                            disabled={isEdit === false}
                            id="free-solo-demo"
                            freeSolo
                            options={appConst.uom_list.map((option) => option.code)}
                            // onChange={(event, newValue) => {
                            //     setUOM(newValue);
                            // }}
                            inputValue={UOM}
                            onInputChange={(event, newInputValue) => {
                                setUOM(newInputValue)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    disabled={isEdit === false}
                                    {...params}
                                    size="small"
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={UOM}
                                    variant="outlined"
                                />
                            )}
                        />

                        {/* <Select
                            open={open}
                            onClose={() => setOpen(false)}
                            onOpen={() => setOpen(true)}
                            value={UOM}
                            onChange={(e) => setUOM(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {uom_list.map((data, i) => (
                                <MenuItem value={data.code} key={i}>
                                    {data.code}
                                </MenuItem>
                            ))}
                        </Select> */}
                        {/* <lable style={errorStydata.datele}>error</lable> */}
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <SubTitle className="w-full" title="Conversion" />
                        <TextField
                            disabled={isEdit === false}
                            value={conversion || ''}
                            onChange={(e) => setConversion(e.target.value > 0 ? e.target.value : '')}
                            size="small"
                            variant="outlined"
                            type='number'
                            sx={{
                                '& legend': { display: 'none' },
                                '& fieldset': { top: 0 },
                            }}
                        />
                        {/* <lable style={errorStydata.datele}>error</lable> */}
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <SubTitle
                            className="w-full"
                            title="Minimum Pack Factor"
                        />
                        <Checkbox
                            disabled={isEdit === false}
                            checked={minPackFactor}
                            onChange={(e) => setMinPackFactor(e.target.checked)}
                            color="primary"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        {/* <lable style={errorStydata.datele}>error</lable> */}
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl>
                        <SubTitle className="w-full" title="Storing Level" />
                        <Checkbox
                            disabled={isEdit === false}
                            checked={storingLevel}
                            onChange={(e) => setStoringLevel(e.target.checked)}
                            color="primary"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        {/* <lable style={errorStydata.datele}>error</lable> */}
                    </FormControl>
                </Grid>
                <Grid
                    item
                    xs={2}
                    style={{
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', bottom: 0 }}>
                        <Tooltip title={!isAdd ? "Save" : "Add"}>
                            <IconButton disabled={isEdit === false} onClick={addSchedule}>
                                {!isAdd ?
                                    <SaveIcon style={{ color: '#03C988' }} /> :
                                    <AddCircleIcon style={{ color: '#03C988' }} />
                                }
                            </IconButton>
                        </Tooltip>
                        {!isAdd && (
                            <Tooltip title="Cancel Update">
                                <IconButton
                                    disabled={isEdit === false}
                                    aria-label="delete"
                                    onClick={cancel}
                                >
                                    <CancelIcon style={{ color: '#FF6464' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </Grid>

                <Grid item xs={12}>
                    {packingDetails.map((data, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    width: '80vw',
                                    margin: '0 auto',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Pack Size</p>}
                                        <p>{data.packSize}</p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>UOM</p>}
                                        <p>{data.UOM}</p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Conversion</p>}
                                        <p>{data?.conversion ? data?.conversion : "N/A"}</p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <p style={{ textAlign: 'center' }}>
                                            {index === 0 && <p style={{ fontWeight: "bold" }}>Min Pack Factor</p>}
                                            {data.minPackFactor ? (
                                                <CheckBoxIcon />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )}
                                        </p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <p style={{ textAlign: 'center' }}>
                                            {index === 0 && <p style={{ fontWeight: "bold" }}>Storing Level</p>}
                                            {data.storingLevel ? (
                                                <CheckBoxIcon />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )}
                                        </p>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {index === 0 && <p style={{ fontWeight: "bold" }}>Action</p>}
                                        <Tooltip title="Remove form List">
                                            <IconButton
                                                disabled={isEdit === false}
                                                onClick={() => remove(index)}
                                            >
                                                <RemoveCircleIcon
                                                    style={{ color: '#F57328' }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Update">
                                            <IconButton
                                                disabled={isEdit === false}
                                                onClick={() => update(index)}
                                            >
                                                <EditIcon
                                                    style={{ color: '#00337C' }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </div>
                        )
                    })}
                </Grid>
            </Grid>
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
    )
}

export default function AssignItem({
    handleClose,
    rowData,
    assignList,
    updateDataTable,
}) {
    const [manufacture, setManufacture] = useState('')
    const [id, setId] = useState(null)
    const [order_list_item_id, setOrderListItemId] = useState(null)
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [price, setPrice] = useState('')
    const [unit, setUnit] = useState('')
    const [unitType, setUnitType] = useState('')
    const [taxCode, setTaxCode] = useState('')
    const [taxPercentage, setTaxPercentage] = useState('')
    const [taxAmount, setTaxAmount] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [total, setTotal] = useState(0)
    const [shelfLife, setShelfLife] = useState('')
    const [orderQuantity, setOrderQuantity] = useState('')
    const [preOrderQuantity, setPreOrderQuantity] = useState(0)
    const [deliverySchedule, setDeliverySchedule] = useState([])
    const [packingDetails, setPackingDetails] = useState([])
    const [discountType, setDiscountType] = useState('percentage')
    const [manufactureList, setManufactureList] = useState([])
    const [remark, setRemark] = useState(RichTextEditor.createEmptyValue())
    const [specification, setSpecification] = useState(RichTextEditor.createEmptyValue())
    const [isDiscount, setIsDiscount] = useState(false);
    const [quantityInPacks, setQuantityInPacks] = useState(0)
    const [subTotal, setSubTotal] = useState(0);
    const [snackbar, setSnackbar] = useState({ alert: false, severity: "success", message: "" })
    const [type, setType] = useState('Shelf Life')
    const [isEdit, setIsEdit] = useState(null)
    const [add, setAdd] = useState(null)

    useEffect(() => {
        if (rowData.assing === true) {
            const getData = assignList.current.find(
                (rs) => rs.rowData.id === rowData.id
            )
            if (getData) {
                const tempItemData = getData.itemData
                setManufacture(tempItemData.manufacture)
                setCountryOfOrigin(tempItemData.countryOfOrigin)
                setPrice(tempItemData.price)
                setUnit(tempItemData.unit)
                setUnitType(tempItemData.unitType)
                setTaxCode(tempItemData.taxCode)
                setTaxPercentage(tempItemData.taxPercentage)
                setTaxAmount(tempItemData.taxAmount)
                setDiscount(tempItemData.discount)
                setDiscountType(tempItemData.discountType)
                setTotal(tempItemData.total)
                setShelfLife(tempItemData.shelfLife)
                setType(tempItemData.type)
                setOrderQuantity(tempItemData.orderQuantity)
                setDeliverySchedule(tempItemData.deliverySchedule)
                setPackingDetails(tempItemData.packingDetails)
                setSubTotal(tempItemData.subTotal)

                if (rowData?.create) {
                    setPreOrderQuantity(tempItemData.orderQuantity)
                }

                console.log("Data: ", rowData?.edit);
                if (!isNull(rowData?.edit) || !isUndefined(rowData?.edit)) {
                    setIsEdit(rowData?.edit)
                    setId(tempItemData?.id)
                    setOrderListItemId(tempItemData?.order_list_item_id)
                }

                if (!isNull(getData?.rowData?.added) || !isUndefined(getData?.rowData?.added)) {
                    setAdd(getData?.rowData?.added)
                }

                if (tempItemData.discount) {
                    setIsDiscount(true)
                }
                if (tempItemData.remark) {
                    setRemark(
                        RichTextEditor.createValueFromString(
                            tempItemData.remark,
                            'html'
                        )
                    )
                }
                if (tempItemData.specification) {
                    setSpecification(
                        RichTextEditor.createValueFromString(
                            tempItemData.specification,
                            'html'
                        )
                    )
                }
            }
        } else {
            const data = assignList.current ? assignList.current : null
            const calculatedQuantity = parseInt(rowData.quantity - rowData.allocated_quantity);
            const totalFromData = Array.isArray(data) ? (parseFloat(data[data.length - 1]?.itemData.total) || 0) : 0;

            setManufacture(Array.isArray(data) ? (data[data.length - 1]?.itemData.manufacture || "") : "");
            setCountryOfOrigin(Array.isArray(data) ? (data[data.length - 1]?.itemData.countryOfOrigin || "") : "")
            setPrice(Array.isArray(data) ? (data[data.length - 1]?.itemData.price || "") : "")
            setUnit(Array.isArray(data) ? (data[data.length - 1]?.itemData.unit || "") : "")
            setUnitType(Array.isArray(data) ? (data[data.length - 1]?.itemData.unitType || "") : "")
            setTaxCode(Array.isArray(data) ? (data[data.length - 1]?.itemData.taxCode || "") : "")
            setTaxPercentage(Array.isArray(data) ? (data[data.length - 1]?.itemData.taxPercentage || "") : "")
            setTaxAmount(Array.isArray(data) ? (data[data.length - 1]?.itemData.taxAmount || "") : "")
            setDiscount(Array.isArray(data) ? (data[data.length - 1]?.itemData.discount || "") : "")
            setDiscountType(Array.isArray(data) ? (data[data.length - 1]?.itemData.discountType || "") : "")
            setIsDiscount(Array.isArray(data) && parseInt(data[data.length - 1]?.itemData.discount) > 0 ? true : false)
            setOrderQuantity(calculatedQuantity > totalFromData ? (Array.isArray(data) && data[data.length - 1]?.itemData.orderQuantity || "") : "");
            setTotal(calculatedQuantity > totalFromData ? totalFromData : "");
            setSubTotal(calculatedQuantity > totalFromData ? (Array.isArray(data) && data[data.length - 1]?.itemData.subTotal || "") : "")
            setShelfLife(Array.isArray(data) ? (data[data.length - 1]?.itemData.shelfLife || "") : "")
            setType(Array.isArray(data) ? (data[data.length - 1]?.itemData.type || "") : "")
            setPackingDetails(Array.isArray(data) ? (data[data.length - 1]?.itemData.packingDetails || []) : [])

            if (Array.isArray(data) && (data[data.length - 1]?.itemData.discount || "").discount) {
                setIsDiscount(true);
            }

            // Item Offered Items
            if (Array.isArray(data) && (data[data.length - 1]?.itemData.remark || "").remark) {
                setRemark(
                    RichTextEditor.createValueFromString(
                        data[data.length - 1]?.remark,
                        'html'
                    )
                );
            }

            // Item Specification
            InventoryService.getItemById(rowData?.primary_item_id ? rowData?.primary_item_id : rowData?.item_id).then(res => {
                if (res.data.view) {
                    setSpecification(
                        RichTextEditor.createValueFromString(
                            res.data.view?.specification,
                            'html'
                        )
                    );
                }
            }).catch(err => {
                console.error("Error: ", err)
            })
        }
    }, [])

    useEffect(() => {

        function hasDecimal(number) {
            return number % 1 !== 0;
        }

        if (packingDetails.length > 0 && orderQuantity) {
            let calSize = packingDetails.reduce((acc, item) => acc * parseFloat(item.packSize), 1);
            let tempQunatityInPacks = orderQuantity / calSize

            if (hasDecimal(tempQunatityInPacks)) {
                tempQunatityInPacks = parseInt(tempQunatityInPacks) + 1
            }


            setQuantityInPacks(tempQunatityInPacks)
        }

    }, [packingDetails, orderQuantity])

    // Total Calculatation
    useMemo(() => {
        if (price && orderQuantity && unit) {

            let tempQunatity = parseInt(orderQuantity) / parseInt(unit)
            tempQunatity = Math.round(tempQunatity);

            let tempTotal = parseFloat(price) * tempQunatity
            // pure total
            setSubTotal(tempTotal)

            if (discount) {
                let tempDiscount = parseFloat(discount)

                if (discountType === 'value') {
                    tempTotal = tempTotal - tempDiscount
                } else {
                    tempTotal = tempTotal - (tempTotal * discount) / 100
                }
            }

            if (taxPercentage) {
                let tempTaxPercentage = parseFloat(taxPercentage)
                let calTax = tempTotal * (tempTaxPercentage / 100)
                tempTotal += calTax
                setTaxAmount(calTax)
            } else {
                setTaxAmount('')
            }
            setTotal(tempTotal)
        }
    }, [price, discount, discountType, taxPercentage, orderQuantity, unit])

    // handl discount status
    useMemo(() => {

        if (!isDiscount) {
            setDiscount(0)
        }

    }, [isDiscount])

    const addItem = () => {
        const itemData = {
            order_list_item_id,
            id,
            manufacture,
            countryOfOrigin,
            price,
            unit,
            unitType,
            taxCode,
            discountType,
            shelfLife,
            type,
            orderQuantity,
            deliverySchedule,
            packingDetails,
            quantityInPacks,
            taxPercentage,
            taxAmount,
            discount,
            total,
            subTotal,
            remark: remark.toString('html'),
            specification: specification.toString('html'),
        }

        // if (deliverySchedule.length > 0 && packingDetails.length > 0) {
        if (deliverySchedule.length > 0) {
            if (rowData.assing == true) {
                let getData = assignList.current.find(
                    (rs) => rs.rowData.id === rowData.id
                )
                getData.itemData = itemData
            } else {
                rowData.assing = true
                let tempList = assignList.current
                assignList.current = [...tempList, { itemData, rowData }]
            }
            updateDataTable(rowData)
        } else {
            setSnackbar({ alert: true, severity: "warning", message: "Please Check Delivery Schedule Details" })
        }
    }

    useEffect(() => {
        if (isEdit && rowData.assing == true) {
            const itemData = {
                order_list_item_id,
                id,
                manufacture,
                countryOfOrigin,
                price,
                unit,
                unitType,
                taxCode,
                discountType,
                shelfLife,
                type,
                orderQuantity,
                deliverySchedule,
                packingDetails,
                quantityInPacks,
                taxPercentage,
                taxAmount,
                discount,
                total,
                subTotal,
                remark: remark.toString('html'),
                specification: specification.toString('html'),
            }

            let getData = assignList.current.find(
                (rs) => rs.rowData.id === rowData.id
            )
            getData.itemData = itemData
        }
    }, [deliverySchedule, packingDetails])

    const loadAllManufacture = (search) => {
        let params = { search: search, limit: 20, page: 0 }
        if (search.length > 2) {
            HospitalConfigServices.getAllManufacturers(params)
                .then((res) => {
                    setManufactureList(res.data.view.data)
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:',
                        err
                    )
                })
        }
    }

    const removeItem = () => {
        let tempList = assignList.current.filter(
            (data) => data.rowData.id !== rowData.id
        )
        console.log("ID: ", id, isEdit)
        if (isEdit && id) {
            SPCServices.deleteSPCPOItem(id).then(res => {
                setSnackbar({ alert: true, severity: "success", message: "Item Details has been removed" })
                assignList.current = tempList
                rowData.assing = false
                updateDataTable(rowData)
            }).catch(err => {
                setSnackbar({ alert: true, severity: "error", message: `Error Code: ${err.code} Error Message: ${err.message}` })
            })
        } else {
            assignList.current = tempList
            rowData.assing = false
            updateDataTable(rowData)
        }
    }

    const onClick = () => setRemark(RichTextEditor.createValueFromString(remark.toString('html') + "<p>°</p>", "html"));
    const customControl = [
        () => <Button
            variant="contained"
            color="secondary"
            startIcon={<PanoramaFishEyeIcon />}
            onClick={onClick}
        >
            Degree
        </Button>];
    // const onChange = (value) => {
    //     setValue(value);
    //     setMarkdown(value.toString("markdown"));
    // };

    return (
        <MainContainer>
            <ValidatorForm onSubmit={addItem}>
                <Grid container spacing={2}>
                    {/* item details */}
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="SR Number" />
                            <Typography
                                variant="body2"
                                className="mt-2"
                                gutterBottom
                            >
                                {rowData?.ItemSnap.sr_no}
                            </Typography>
                        </FormControl>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Schedule Date" />
                            <Typography
                                variant="body2"
                                className="mt-2"
                                gutterBottom
                            >
                                {dateParse(rowData?.order_date_to)}
                            </Typography>
                        </FormControl>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Order Quantity" />
                            <Typography
                                variant="body2"
                                className="mt-2"
                                gutterBottom
                            >
                                {rowData?.quantity}
                            </Typography>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={2} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Allocated Quantity" />
                            <Typography
                                variant="body2"
                                className="mt-2"
                                gutterBottom
                            >
                                {rowData?.create ? rowData?.allocated_quantity - preOrderQuantity : rowData?.allocated_quantity}
                            </Typography>
                        </FormControl>
                    </Grid>

                    <Grid item lg={10} md={10} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Description" />
                            <Typography
                                variant="body2"
                                className="mt-2"
                                gutterBottom
                            >
                                {
                                    rowData?.ItemSnap?.long_description
                                }
                            </Typography>
                        </FormControl>
                    </Grid>



                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Manufacture" />
                            <Autocomplete
                                disabled={isEdit === false}
                                className="w-full"
                                options={manufactureList}
                                value={manufacture ? manufacture : null}
                                onChange={(event, value) => {
                                    setManufacture(value)
                                }}
                                getOptionLabel={(option) => option?.name}
                                getOptionSelected={(option, value) =>
                                    option.name === value.name
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={isEdit === false}
                                        {...params}
                                        placeholder="Manufacture Name (Type 3 Letters)"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={manufacture?.name}
                                        onChange={(event) => {
                                            loadAllManufacture(
                                                event.target.value
                                            )
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Country of Origin" />
                            <Autocomplete
                                disabled={isEdit === false}
                                className="w-full"
                                options={appConst.countryOfOrigin}
                                value={countryOfOrigin ? countryOfOrigin : null}
                                onChange={(event, value) => {
                                    setCountryOfOrigin(value)
                                }}
                                getOptionLabel={(option) => `${option?.code} - ${option?.description}`}
                                getOptionSelected={(option, value) => option.description === value.description}
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={isEdit === false}
                                        {...params}
                                        placeholder="Country of Origin"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={countryOfOrigin ? countryOfOrigin.description : ''}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title={type === "Warranty" ? 'Warranty' : "Shelf Life"} />
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ flex: 1, marginRight: "5px" }}>
                                    <Autocomplete
                                        disabled={isEdit === false}
                                        disableClearable
                                        className="w-full mr-2"
                                        options={[{ label: "Shelf Life" }, { label: "Warranty" }]}
                                        value={type ? { label: type } : null} // Use an object with a label property to match the option format
                                        onChange={(event, value) => {
                                            setType(value ? value.label : null); // Update the type state with the selected label
                                        }}
                                        getOptionLabel={(option) => option?.label} // No need for the string template here
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Type"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={type ? type : ''}
                                            />
                                        )}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <TextValidator
                                        disabled={isEdit === false}
                                        fullWidth
                                        placeholder={type === "Warranty" ? "Warranty" : "Shelf Life"}
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={shelfLife}
                                        onChange={(e) => setShelfLife(e.target.value)}
                                    // validators={['isNumber', 'minNumber:1']}
                                    // errorMessages={['Numbers only', 'Qty Should Greater-than: 0 ',]}
                                    />
                                </div>
                            </div>
                        </FormControl>
                    </Grid>
                    {/* price details */}
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6">
                            Item Quantity Details
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <Typography className="font-semibold text-13 mt-2" style={parseInt(rowData.quantity - rowData.allocated_quantity) > 0 || rowData?.create ? { lineHeight: '1', color: 'green' } : { lineHeight: '1', color: "red" }}>{`Order Quantity ( Available Quantity ${rowData?.create ? parseInt(rowData.quantity - rowData.allocated_quantity) + parseFloat(preOrderQuantity) : parseInt(rowData.quantity - rowData.allocated_quantity)})`}</Typography>
                            <TextValidator
                                disabled={!isNull(add) && add === true || isEdit === false}
                                fullWidth
                                placeholder="Order Quantity"
                                name="orderQuantity"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={orderQuantity}
                                onChange={(e) =>
                                    setOrderQuantity(e.target.value)
                                }
                                validators={rowData?.create ? [
                                    'required',
                                    'isNumber',
                                    'minNumber:1',
                                    `maxNumber:${parseInt(parseInt(rowData.quantity - rowData.allocated_quantity) + parseInt(preOrderQuantity))}`,
                                ] : [
                                    'required',
                                    'isNumber',
                                    'minNumber:1',
                                    `maxNumber:${parseInt(
                                        rowData.quantity -
                                        rowData.allocated_quantity
                                    )}`,
                                ]}
                                errorMessages={rowData?.create ? [
                                    'This Field is Required',
                                    'Numbers only',
                                    'Qty Should Greater-than: 0 ',
                                    'Over Quantity',
                                ] : [
                                    'This Field is Required',
                                    'Numbers only',
                                    'Qty Should Greater-than: 0 ',
                                    'Over Quantity',
                                ]}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl className="w-full">
                            <SubTitle title="Unit Price" />
                            <TextValidator
                                disabled={isEdit === false}
                                fullWidth
                                placeholder="Unit Price"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                validators={['isFloat', 'minNumber:0', 'required']}
                                errorMessages={[
                                    'Invalid price format',
                                    'Qty Should Greater-than: 0 ',
                                    'This Field is Required',
                                ]}
                            />
                        </FormControl>
                    </Grid>

                    {/* price details */}
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6">
                            Price Details
                        </Typography>
                        <Divider />
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>


                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={isEdit === false}
                                    checked={isDiscount}
                                    onChange={(e) => setIsDiscount(e.target.checked)}
                                    name="Add Discount"
                                    color="primary"
                                />
                            }
                            label="Add Discount"
                        />

                        {isDiscount && (<FormControl className="w-full">
                            <SubTitle title="Discount" />
                            <RadioGroup
                                name="category"
                                value={discountType || ''}
                                onChange={(e) =>
                                    setDiscountType(e.target.value)
                                }
                                style={{ display: 'block' }}
                            >
                                <FormControlLabel
                                    disabled={isEdit === false}
                                    value="percentage"
                                    control={<Radio />}
                                    label="%"
                                />
                                <FormControlLabel
                                    disabled={isEdit === false}
                                    value="value"
                                    control={<Radio />}
                                    label="Value"
                                />
                            </RadioGroup>

                            <TextValidator
                                disabled={isEdit === false}
                                fullWidth
                                placeholder="Discount"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                validators={discountType === "percentage" ? ['isFloat', 'minNumber:0', 'maxNumber:100'] : ['isFloat', 'minNumber:0']}
                                errorMessages={discountType === 'percentage' ? [
                                    'Numbers Only',
                                    'Qty Should Greater-than: 0 ',
                                    'Qty Should Less-than: 100 ',
                                ] : [
                                    'Numbers Only',
                                    'Qty Should Greater-than: 0 ']}
                            />
                        </FormControl>)}


                        <FormControl className="w-full">
                            <SubTitle title="Total" />
                            <Typography variant="subtitle2">
                                {convertTocommaSeparated(total, 4)}
                            </Typography>
                        </FormControl>
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <SubTitle title="UOM" />
                                    <Autocomplete
                                        disabled={isEdit === false}
                                        className="w-full"
                                        options={appConst.uom_list}
                                        value={
                                            appConst.uom_list.find(
                                                (option) =>
                                                    option.code === unitType
                                            ) || null
                                        }
                                        onChange={(event, value) => {
                                            setUnitType(value?.code)
                                        }}
                                        getOptionLabel={(option) =>
                                            option.code
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                disabled={isEdit === false}
                                                {...params}
                                                placeholder="Unit Type"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={unitType}
                                                validators={['required']}
                                                errorMessages={[
                                                    'This Field is Required',
                                                ]}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl className="w-full">
                                        <SubTitle title="Pack Size" />
                                        <Tooltip title="Enter the unit of measure for pricing this item code">
                                            <TextValidator
                                                disabled={isEdit === false}
                                                fullWidth
                                                placeholder="No"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                value={unit}
                                                onChange={(e) =>
                                                    setUnit(e.target.value)
                                                }
                                                validators={['isFloat', 'minNumber:1', 'required']}
                                                errorMessages={[
                                                    'Invalid Number Format',
                                                    'Qty Should Greater-than: 0 ',
                                                    'This Field is Required'
                                                ]}
                                            />
                                        </Tooltip>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </FormControl>


                        <FormControl className="w-full">
                            <SubTitle title="Tax Code" />
                            <TextValidator
                                disabled={isEdit === false}
                                fullWidth
                                placeholder="Tax Code"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={taxCode}
                                onChange={(e) => setTaxCode(e.target.value)}
                            // validators={['required']}
                            // errorMessages={['this field is required']}
                            />
                        </FormControl>


                        <FormControl className="w-full">
                            <SubTitle title="Tax Precentage" />
                            <TextValidator
                                disabled={isEdit === false}
                                fullWidth
                                placeholder="Tax Precentage"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={taxPercentage}
                                onChange={(e) =>
                                    setTaxPercentage(e.target.value)
                                }
                                validators={['isFloat', 'minNumber:0', 'maxNumber:100']}
                                errorMessages={['Numbers only', 'Qty Should Greater-than: 0', 'Qty Should Less-than: 100 ']}
                            />
                        </FormControl>



                        <FormControl className="w-full">
                            <SubTitle title="Tax Amount" />
                            <Typography variant="subtitle2">
                                {convertTocommaSeparated(taxAmount, 4)}
                            </Typography>
                        </FormControl>

                    </Grid>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6">
                            MSD Specification
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item lg={10} md={10} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <RichTextEditor
                                disabled={true}
                                value={specification}
                                onChange={(value) => setSpecification(value)}
                                editorClassName="custom-editor-sm"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6">
                            Offered Items
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item lg={10} md={10} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <RichTextEditor
                                disabled={isEdit === false}
                                customControls={customControl}
                                value={remark}
                                onChange={(value) => setRemark(value)}
                                editorClassName="custom-editor-sm"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6">
                            Delivery Schedule
                        </Typography>
                        <Divider />

                        <DeliverySchedule
                            allocatedQuantity={rowData?.create ? parseInt(rowData.quantity - rowData.allocated_quantity) + parseInt(preOrderQuantity) : parseInt(rowData.quantity - rowData.allocated_quantity)}
                            Add={add}
                            POItemId={id}
                            isEdit={isEdit}
                            deliverySchedule={deliverySchedule}
                            setDeliverySchedule={setDeliverySchedule}
                            orderQuantity={orderQuantity}
                            unitType={unitType}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6">
                            Packing Details
                        </Typography>
                        <Divider />

                        <PackingDetails
                            POItemId={id}
                            Add={add}
                            isEdit={isEdit}
                            packingDetails={packingDetails}
                            setPackingDetails={setPackingDetails}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        {rowData.assing === true && (
                            <Button
                                disabled={isEdit === false}
                                variant="contained"
                                color="primary"
                                className="mr-2"
                                onClick={removeItem}
                            >
                                Remove
                            </Button>
                        )}

                        <Button
                            disabled={isEdit === false}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {rowData?.assing ? "Update" : "Add"}
                        </Button>
                    </Grid>
                </Grid>
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
        </MainContainer>
    )
}
