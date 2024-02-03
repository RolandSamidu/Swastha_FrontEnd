import React, { useState, useContext, useEffect, useMemo } from 'react'
import Button from 'app/components/LoonsLabComponents/Button'
import {
    Grid,
    FormControl,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@material-ui/core'
import { MainContainer, SubTitle } from 'app/components/LoonsLabComponents'
import { PageContext } from '../PageContext'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { convertTocommaSeparated } from 'utils'

export default function OthersGeneral({ POData }) {
    const [pageData, setPageData] = useContext(PageContext)
    const [conversion, setConversion] = useState(POData.current.OthersGeneral?.conversion || '0')
    const [freightChargers, setFreightChargers] = useState(POData.current.OthersGeneral?.freightChargers || '0')
    const [handlAndPackagingCharge, setHandlAndPackagingCharge] = useState(POData.current.OthersGeneral?.handlAndPackagingCharge || '0')
    const [otherCharge, setOtherCharge] = useState(POData.current.OthersGeneral?.otherCharge || '0')
    const [commissionValue, setCommissionValue] = useState(0)
    const [commissionType, setCommissionType] = useState(POData.current.OthersGeneral?.commissionType || 'percentage')
    const [commission, setCommission] = useState({ value: 0, percentage: 0 })
    const [grandTotal, setGrandTotal] = useState(POData.current.OthersGeneral?.grandTotal || 0)
    const [subTotal, setSubTotal] = useState(0)// include  discount and tax calclulation
    const [pureSubTotal, setPureSubTotal] = useState(0)// without include  discount and tax calclulation
    const [saving, setSaving] = useState(false)

    const [currency, setCurrency] = useState(POData.current.intend?.currency)
    const [exchangeRate, setExchangeRate] = useState(POData.current.intend?.exchangeRate || null)



    useEffect(() => {
        // calculate sub total
        const calSubTotal = () => {
            if (POData.current.ItemsDetails?.length > 0) {
                let tempSubTotal = 0
                let tempPureSubTotal = 0
                const itemsDatails = POData.current.ItemsDetails

                for (let item of itemsDatails) {
                    let { itemData } = item

                    tempSubTotal += parseFloat(itemData.total)
                    tempPureSubTotal += parseFloat(itemData.subTotal)
                }

                setSubTotal(tempSubTotal)
                setPureSubTotal(tempPureSubTotal)
                return tempSubTotal
            }
            return 0
        }

        // calculate grand total
        if (POData.current.intend?.POType === 'L') {

            let tempSubTotal = calSubTotal()
            setGrandTotal(tempSubTotal)

        } else if (POData.current.intend?.POType === 'F') {

            const tempCommission = POData.current.OthersGeneral?.commission ? POData.current.OthersGeneral.commission : { value: 0, percentage: 0 }


            let tempSubTotal = calSubTotal()

            let tempGrandTotal =
                tempSubTotal +
                parseFloat(freightChargers) +
                parseFloat(handlAndPackagingCharge) +
                parseFloat(otherCharge) -
                parseFloat(tempCommission.value)

            setGrandTotal(tempGrandTotal)

            if (POData.current.OthersGeneral?.commissionType) {
                POData.current.OthersGeneral.commissionType === 'percentage' ? setCommissionValue(tempCommission.percentage) : setCommissionValue(tempCommission.value)
            }
        }
    }, [])

    const calCommission = (total) => {

        let tempCommissionValue = commissionValue ? parseFloat(commissionValue) : 0
        let value = 0
        let percentage = 0

        if (commissionType === 'percentage') {
            value = (total * tempCommissionValue) / 100
            percentage = tempCommissionValue
        } else {
            value = tempCommissionValue
            percentage = (tempCommissionValue / total) * 100
            percentage = percentage.toFixed(2)
        }

        setCommission({ value, percentage })
        return { value, percentage }
    }

    useMemo(() => {
        let tempFreightChargers = freightChargers ? parseFloat(freightChargers) : 0
        let tempHandlAndPackagingCharge = handlAndPackagingCharge ? parseFloat(handlAndPackagingCharge) : 0
        let tempOtherCharge = otherCharge ? parseFloat(otherCharge) : 0
        let tempGrandTotal =
            subTotal +
            tempFreightChargers +
            tempHandlAndPackagingCharge +
            tempOtherCharge

        let tempCommission = calCommission(tempGrandTotal).value

        tempGrandTotal -= tempCommission

        setGrandTotal(tempGrandTotal)
    }, [freightChargers, handlAndPackagingCharge, otherCharge, commissionValue, commissionType])

    const saveData = () => {
        POData.current.OthersGeneral = {
            conversion,
            freightChargers,
            handlAndPackagingCharge,
            otherCharge,
            commissionValue,
            commissionType,
            commission,
            grandTotal,
            subTotal,
            pureSubTotal,

            currency,
            exchangeRate,
        }

    }

    const handleNext = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 3 }
        setPageData(tempPageData)
    }

    const handleBack = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 1 }
        setPageData(tempPageData)
    }

    const updateData = () => {
        saveData()
        setSaving(true)
    }

    return (
        <MainContainer>
            <ValidatorForm onSubmit={handleNext}>
                <Grid
                    container
                    spacing={2}
                    style={{ display: 'flex', flexDirection: 'center' }}
                >
                    {/* <Grid
                        item
                        xs={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={updateData}
                        >
                            save
                        </Button>
                    </Grid> */}
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Conversion" />
                            <TextValidator
                                disabled={pageData.isPosted}
                                fullWidth
                                placeholder="Conversion"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={conversion}
                                onChange={(e) => setConversion(e.target.value)}
                                validators={['isFloat', 'minNumber:0']}
                                errorMessages={['Invalid Format',
                                    'Qty Should Greater-than: 0 ',]}
                            />
                        </FormControl>

                        {POData.current.intend?.POType === 'F' && (
                            <FormControl className="w-full">
                                <SubTitle title="Freight Chargers" />
                                <TextValidator
                                    disabled={pageData.isPosted}
                                    fullWidth
                                    placeholder="Freight Chargers"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={freightChargers}
                                    onChange={(e) =>
                                        setFreightChargers(e.target.value)
                                    }
                                    validators={['isFloat', 'minNumber:0']}
                                    errorMessages={['Invalid Format',
                                        'Qty Should Greater-than: 0 ',]}
                                />
                            </FormControl>
                        )}

                        {POData.current.intend?.POType === 'F' && (
                            <FormControl className="w-full">
                                <SubTitle title="Commission" />
                                <RadioGroup
                                    name="category"
                                    value={commissionType}
                                    onChange={(e) => {
                                        setCommissionType(e.target.value);
                                        setCommissionValue(0);
                                    }
                                    }
                                    style={{ display: 'block' }}
                                >
                                    <FormControlLabel
                                        disabled={pageData.isPosted}
                                        value="percentage"
                                        control={<Radio />}
                                        label="%"
                                    />
                                    <FormControlLabel
                                        disabled={pageData.isPosted}
                                        value="value"
                                        control={<Radio />}
                                        label="Value"
                                    />
                                </RadioGroup>
                                <TextValidator
                                    disabled={pageData.isPosted}
                                    fullWidth
                                    placeholder="Commission"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={commissionValue}
                                    onChange={(e) =>
                                        setCommissionValue(e.target.value)
                                    }
                                    validators={commissionType === 'percentage' ? ['isFloat', 'minNumber:0', 'maxNumber:100'] : ['isFloat', 'minNumber:0',]}
                                    errorMessages={commissionType === 'percentage' ? ['Invalid Format', 'Qty Should be Greater-than: 0 ', 'Qty Should be Less-than: 100'] : ['Invalid price format', 'Qty Should Greater-than: 0 ']}
                                />
                            </FormControl>
                        )}
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        {POData.current.intend?.POType === 'F' && (
                            <FormControl className="w-full">
                                <SubTitle title="Handling & Packaging Chargers" />
                                <TextValidator
                                    disabled={pageData.isPosted}
                                    fullWidth
                                    placeholder="Handling & Packaging Chargers"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={handlAndPackagingCharge}
                                    onChange={(e) =>
                                        setHandlAndPackagingCharge(
                                            e.target.value
                                        )
                                    }
                                    validators={['isFloat', 'minNumber:0']}
                                    errorMessages={['Invalid Format',
                                        'Qty Should Greater-than: 0 ',]}
                                />
                            </FormControl>
                        )}
                        <FormControl className="w-full">
                            <SubTitle title="Other Chargers" />
                            <TextValidator
                                disabled={pageData.isPosted}
                                fullWidth
                                placeholder="Other Chargers"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={otherCharge}
                                onChange={(e) =>
                                    setOtherCharge(e.target.value)
                                }
                                validators={['isFloat', 'minNumber:0']}
                                errorMessages={['Invalid Format',
                                    'Qty Should Greater-than: 0 ',]}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Grand Total" />
                            <Typography variant="subtitle2">
                                {`${currency?.cc} ${convertTocommaSeparated(grandTotal, 2)} ( = LKR ${convertTocommaSeparated(grandTotal*exchangeRate, 2)})  `}
                            </Typography>
                            
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
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
                                    endIcon='chevron_right'
                                    variant="contained"
                                    // color="primary"
                                    style={{
                                        backgroundColor: "#4BB543"
                                    }}
                                    onClick={handleNext}
                                >
                                    Save & Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>
            <LoonsSnackbar
                open={saving}
                onClose={() => {
                    setSaving(false)
                }}
                message="Data Saved"
                autoHideDuration={1200}
                severity="success"
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </MainContainer>
    )
}
