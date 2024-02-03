import React, { useContext, useState, useEffect } from 'react'
import { Grid, TextField, CircularProgress, FormControl, } from '@material-ui/core'
import Button from 'app/components/LoonsLabComponents/Button'
import { MainContainer, SubTitle, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import PO from '../../../../Print/PO'
import { PageContext } from '../PageContext'
import PreviewPO from './PreviewPO'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import WarehouseServices from 'app/services/WarehouseServices'
import SPCServices from 'app/services/SPCServices'
import { Autocomplete } from '@material-ui/lab'
import localStorageService from 'app/services/localStorageService'
import { ConfirmationDialog } from 'app/components'
const selectionData = {
    type: [
        { label: 'Draft' },
        { label: 'Original' },
    ],
    signature: [
        { label: 'MANAGER IMPORTS' },
        { label: 'MANAGER IMPORTS/ACTG. DGM(P&I)' },
        // { label: 'PROCUREMENT OFFICER(DHS/SURGICAL/PHARMACEUTICAL)' },
        { label: 'PROCUREMENT OFFICER' },
    ],
}

export default function Print({ POData }) {
    const [pageData, setPageData] = useContext(PageContext)
    const [open, setOpen] = useState(false)
    const [progess, setProgress] = useState(false)
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState({ value: 0, percentage: 0 })
    const [tax, setTax] = useState({ value: 0, percentage: 0 })
    const [MSDConditionsList, setMSDConditionsList] = useState([])
    // const [PONo, setPONo] = useState('')
    const [printType, setPrintType] = useState('Draft')
    const [dataIsLoading, setDataIsLoading] = useState(false)
    const [signature, setSignature] = useState('MANAGER IMPORTS')
    const [snackbar, setSnackbar] = useState({ message: "", alert: false, severity: "success" })
    const [submitOpen, setSubmitOpen] = useState(false)

    const calDiscount = (price, orderQuantity, unit, discount, discountType) => {
        if (discountType === 'percentage') {
            return ((orderQuantity / unit) * price) * (discount / 100)
        } else {
            return discount
        }
    }

    useEffect(() => {
        // TODO error handle

        if (POData.current.OthersGeneral) {
            if (POData.current.intend?.POType === 'L') {
                const { grandTotal } = POData.current.OthersGeneral

                if (grandTotal) {
                    setTotal(grandTotal)
                }

                if (POData.current.ItemsDetails) {
                    let list = POData.current.ItemsDetails
                    let tempDiscount = 0
                    let tempTax = 0
                    let tempSubTotal = POData.current.OthersGeneral.subTotal

                    for (let data of list) {
                        tempDiscount += calDiscount(
                            parseFloat(data.itemData.price),
                            parseFloat(data.itemData.orderQuantity),
                            parseFloat(data.itemData.unit),
                            parseFloat(data.itemData.discount),
                            data.itemData.discountType
                        )

                        if (data.itemData.taxAmount) {
                            tempTax += parseFloat(data.itemData.taxAmount)
                        }
                    }

                    let tempDiscountPercentage =
                        (tempDiscount / tempSubTotal) * 100
                    let tempTaxPercentage = (tempTax / tempSubTotal) * 100

                    setDiscount({
                        value: tempDiscount,
                        percentage: tempDiscountPercentage.toFixed(1),
                    })

                    setTax({
                        value: tempTax,
                        percentage: tempTaxPercentage.toFixed(1),
                    })
                }
            } else if (POData.current.intend?.POType === 'F') {
                const { grandTotal, commission } = POData.current.OthersGeneral

                if (grandTotal && commission) {
                    let temTotal =
                        parseFloat(grandTotal) + parseFloat(commission.value)
                    setTotal(temTotal)
                }

                if (POData.current.ItemsDetails) {
                    let list = POData.current.ItemsDetails
                    let tempDiscount = 0
                    let tempTax = 0
                    let tempSubTotal = POData.current.OthersGeneral.subTotal

                    for (let data of list) {
                        tempDiscount += calDiscount(
                            parseFloat(data.itemData.price),
                            parseFloat(data.itemData.orderQuantity),
                            parseFloat(data.itemData.unit),
                            parseFloat(data.itemData.discount),
                            data.itemData.discountType
                        )

                        if (data.itemData.taxAmount) {
                            tempTax += parseFloat(data.itemData.taxAmount)
                        }
                    }

                    let tempDiscountPercentage =
                        (tempDiscount / tempSubTotal) * 100
                    let tempTaxPercentage = (tempTax / tempSubTotal) * 100

                    setDiscount({
                        value: tempDiscount,
                        percentage: tempDiscountPercentage.toFixed(1),
                    })

                    setTax({
                        value: tempTax,
                        percentage: tempTaxPercentage.toFixed(1),
                    })
                }
            }
        }

        const getMSDConditinsList = async () => {
            let params = { limit: 99999, page: 0 }
            const res = await WarehouseServices.getConditions(params)
            const { data } = res.data.view
            setMSDConditionsList(data)
        }

        getMSDConditinsList()

    }, [])

    const handleBack = () => {
        const tempPageData = { ...pageData, activeStep: 5 }
        setPageData(tempPageData)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const createPO = async () => {
        setDataIsLoading(true)
        setProgress(true);
        let userID = await localStorageService.getItem('userInfo')?.id
        let ownerID = await localStorageService.getItem('owner_id')

        const { intend, OthersGeneral, noteAndAttachment, conditions, shipping_conditions, ItemsDetails } = POData.current

        console.log("ItemsDetails check", ItemsDetails)
        console.log('arrIn0',ItemsDetails[0].itemData.manufacture?.id )

        const data = {
            "order_no": intend.orderNo,
            "agent_id": intend.procurementAgent?.id,
            "supplier_id": intend.suppplierDetails?.id,
            'local_agent_id': intend.localAgent?.id,
            'manufacture_id': ItemsDetails[0].itemData.manufacture?.id,
            // TODO: remove hard code
            // "supplier_id": "ab44e788-6f1d-4da2-9149-b32e96db8dcd",
            // 'local_agent_id': '63ad9ed3-b5b0-44cc-ba51-ad42e2370d33',
            // "manufacture_id": "5ba9afb0-f3c7-4910-a83b-67d684acaa7f", // ?
            // "estimation_id": "142af638-9171-46ac-947c-9113e2c0f717", // ?

            // TODO: remove hard code
            // "order_date": "2023-05-26", // ?
            // "order_date_to": "2023-08-24", // ?

            "category_id": pageData.categoryId,
            "order_list_id": intend.orderId,
            "po_type": intend.POType,
            "currency": intend.currency?.cc,
            "currency_short": intend.currency?.cc,
            "currency_date": intend?.currencyDate,
            "mode_of_dispatch": intend.modeOfDispatch?.join(' & '),
            "tender_no": intend.tenderNo,
            "payment_terms": intend.paymentTerms?.name,
            "payment_terms_short": intend.paymentTerms?.label,
            "exchange_rate": intend?.exchangeRate,
            'inco_terms': intend?.incoTerms,
            "import_license_no": intend?.bankDetails?.importLicenseNo,
            "valid_date": intend?.bankDetails?.validUpTo,

            "quoted_unit_price": intend.quotedUnitPrice,
            "hs_code": intend.HSCode,
            "indent_no": intend.intentNo,
            "status": "Draft",
            "type": pageData.type,
            "created_by": userID,

            "owner_id": ownerID,
            "notes": noteAndAttachment.note,
            "additional_conditions": conditions,
            "conversion": OthersGeneral.conversion,
            "freight_chargers": OthersGeneral.freightChargers,
            "handl_and_packaging_charge": OthersGeneral.handlAndPackagingCharge,
            "other_charge": OthersGeneral.otherCharge,
            "commission": OthersGeneral.commission?.value,
            "commission_precentage": OthersGeneral.commission?.percentage,
            "grand_total": OthersGeneral.grandTotal,
            "sub_total": OthersGeneral.subTotal,
            "total_tax": tax?.value,
            "total_discount": discount?.value,
            "total_payable": total,
            "bank_details": intend.bankDetails.bank ? [intend.bankDetails.bank] : [],

            "bank_details_id": intend.bankDetails.bank?.id,
            // "shipping_conditions": [
            //     {
            //         default_condition_id: shipping_conditions?.id,
            //         type: shipping_conditions?.type,
            //         conditions: shipping_conditions?.condition,
            //     }
            // ],
        }

        if (intend.POType === "F") {
            data.shipping_conditions = [
                {
                    default_condition_id: shipping_conditions?.id,
                    type: shipping_conditions?.type,
                    conditions: shipping_conditions?.condition,
                }
            ];
        } else if (pageData.category !== 'Pharmaceutical' && intend.POType === "L") {
            data.shipping_conditions = [
                {
                    default_condition_id: shipping_conditions?.id,
                    type: shipping_conditions?.type,
                    conditions: shipping_conditions?.condition,
                }
            ];
        }

        data.item_details = ItemsDetails.map((item) => {
            const { itemData, rowData } = item
            let tempData = {
                "manufacture_id": itemData.manufacture?.id,

                // TODO: Remove Hard Coded 
                // "manufacture_id": "7995b6bf-06c9-4d97-8a15-497f2e705475",
                // "item": rowData?.id,
                "order_list_item_id": rowData?.id,
                "item_id": rowData?.item_id,
                "country_of_origin": itemData.countryOfOrigin?.description,
                "price": itemData.price ? parseFloat(itemData.price) : 0,
                "unit": itemData.unit,
                "unit_type": itemData.unitType,
                "tax_code": itemData.taxCode,
                "tax_percentage": itemData.taxPercentage ? parseFloat(itemData.taxPercentage) : 0,
                "tax_amount": itemData.taxAmount ? parseFloat(itemData.taxAmount) : 0,
                "discount": calDiscount(parseFloat(itemData?.price ?? 0), parseFloat(itemData?.orderQuantity ?? 0), parseFloat(itemData?.unit ?? 0), parseFloat(itemData?.discount ?? 0), itemData.discountType),
                'discount_precentage': itemData.discount ? parseFloat(itemData.discount) : 0,
                "discount_type": itemData.discountType,
                "total": itemData.total,
                "remark": itemData.remark,
                "specification": itemData.specification,
                "shelf_life": itemData.type === 'Warranty' ? '' : itemData.shelfLife,
                "warranty": itemData.type === 'Warranty' ? itemData.shelfLife : "",
                "order_quantity": itemData.orderQuantity ? parseFloat(itemData.orderQuantity) : 0,
                "delivery_schedule": itemData.deliverySchedule.map((rs) => {
                    return {
                        "shedule_date": rs.sheduleDate,
                        "delivery_location": rs.deliveryLocation,
                        "quantity": rs.quantity,
                        "remarks": rs.remark
                    }
                }),
                "packing_details": itemData.packingDetails.map((rs) => {
                    return {
                        "pack_size": parseFloat(rs.packSize),
                        "uom": rs.UOM,
                        "quantity": parseInt(rs.quantity, 10),
                        "conversion": parseFloat(rs.conversion),
                        "min_pack_factor": rs.minPackFactor,
                        "storing_level": rs.storingLevel
                    }
                })
            }
            return tempData
        })

        // // TODO : remove this
        // let randomNumber = Math.floor(Math.random() * 900000) + 100000;
        // setPONo(randomNumber)

        // Updated Code
        SPCServices.createPurchaseOrder(data).then((rs) => {
            console.log('manufacture_id',ItemsDetails[0].itemData.manufacture?.id)
            const { po_no } = rs.data.posted
            // setPONo(po_no)
            setPageData({ ...pageData, isPosted: true, PONo: po_no })
            setSnackbar({ message: "Created Purchase Order Successfully", severity: "success", alert: true });

        }).catch((error) => {
            console.log("🚀 ~ file: Print.jsx:212 ~ SPCServices.createPurchaseOrder ~ error:", error);
            setSnackbar({ message: `Error Occured: ${error}`, severity: "error", alert: true });
        }).finally(() => {
            setDataIsLoading(false)
            setProgress(false)

        })

        setDataIsLoading(false)
        setProgress(false)
        console.log("🚀 ~ file: Print.jsx:187 ~ data.item_details=ItemsDetails.map ~ data:", data)
    }

    return (
        <MainContainer>
            <Grid
                container
                spacing={2}
            // style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Grid item xs={12}>
                    <p>Create Purchase Order</p>
                </Grid>
                <Grid item xs={6}>
                    <FormControl className="w-full">
                        <SubTitle title="Print Type" />
                        <Autocomplete
                            className="w-full"
                            value={printType ? { label: printType } : null}
                            options={selectionData.type}
                            onChange={(event, value) => {
                                setPrintType(value?.label)
                            }}
                            getOptionLabel={(option) => option.label}
                            getOptionSelected={(option, value) =>
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={printType}
                                    variant="outlined"
                                />
                            )}
                        />
                    </FormControl>

                    {/* <FormControl className="w-full">
                        <SubTitle title="Print Signature" />
                        <Autocomplete
                            className="w-full"
                            value={signature ? { label: signature } : null}
                            options={selectionData.signature}
                            onChange={(event, value) => {
                                setSignature(value?.label)
                            }}
                            getOptionLabel={(option) => option.label}
                            getOptionSelected={(option, value) =>
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={signature}
                                    variant="outlined"
                                />
                            )}
                        />
                    </FormControl> */}

                </Grid>
                {/* <Grid item xs={2}>
                    {POData.current.intend && POData.current.OthersGeneral && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setOpen(true)
                            }}
                        >
                            Preview PO
                        </Button>
                    )}
                </Grid> */}
                <Grid item xs={2}>
                    {/* {!pageData.isPosted && (
                        <Button
                            disabled={pageData.isPosted}
                            variant="contained"
                            color="primary"
                            onClick={createPO}
                        >
                            Create PO
                        </Button>
                    )} */}

                    {dataIsLoading && (
                        <div className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </div>
                    )}
                </Grid>
                {/* <Grid item xs={2}>
                    {pageData.isPosted && (
                        <PO
                            POData={POData}
                            type={printType}
                            discount={discount}
                            tax={tax}
                            total={total}
                            PONo={pageData.PONo}
                            signature={signature}
                            MSDConditionsList={MSDConditionsList}
                        />
                    )}
                </Grid> */}
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
                                startIcon='chevron_left'
                                variant="contained"
                                // color="primary"
                                style={{
                                    backgroundColor: "#ff0e0e"
                                }}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            {POData.current.intend && POData.current.OthersGeneral && (
                                <>
                                    <Button
                                        className='mr-2 mt-2'
                                        startIcon='preview'
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            Array.isArray(POData.current.ItemsDetails) && POData.current.ItemsDetails.length === 0 ?
                                                setSnackbar({ alert: true, severity: 'warning', message: "Please Add Some Items to Continue" })
                                                : setOpen(true)
                                        }}
                                    >
                                        Preview PO
                                    </Button>
                                    {pageData.isPosted ?
                                        (<PO
                                            POData={POData}
                                            type={printType}
                                            discount={discount}
                                            tax={tax}
                                            total={total}
                                            PONo={pageData.PONo}
                                            Category={pageData.category}
                                            // signature={signature}
                                            MSDConditionsList={MSDConditionsList}
                                        />) : (
                                            <LoonsButton
                                                className='mt-2'
                                                endIcon='save'
                                                disabled={pageData.isPosted}
                                                variant="contained"
                                                // color="primary"
                                                progress={progess}
                                                style={{
                                                    backgroundColor: "#4BB543"
                                                }}
                                                onClick={() => {
                                                    Array.isArray(POData.current.ItemsDetails) && POData.current.ItemsDetails.length === 0 ?
                                                        setSnackbar({ alert: true, severity: 'warning', message: "Please Add Some Items to Continue" }) :
                                                        setSubmitOpen(true);
                                                }}
                                            >
                                                Create PO
                                            </LoonsButton>
                                        )}
                                </>)
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                </Grid>
            </Grid>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <DialogTitle style={{ borderBottom: '1px solid #000' }}>
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
                </DialogTitle>
                <DialogContent>
                    <PreviewPO
                        POData={POData}
                        discount={discount}
                        tax={tax}
                        total={total}
                        PONo={pageData.PONo}
                        Category={pageData.category}
                        type={printType}
                        MSDConditionsList={MSDConditionsList}
                    />
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                text={POData?.current?.intend?.POType === 'L' ? "You are creating a Local Purchase Order. Are you sure you want to continue?" : "You are creating a Foreign Indent. Are you sure you want to continue?"}
                open={submitOpen}
                onConfirmDialogClose={() => { setSubmitOpen(false) }}
                onYesClick={() => {
                    setSubmitOpen(false);
                    createPO();
                }}
            />
            <LoonsSnackbar
                open={snackbar.alert}
                onClose={() => {
                    setSnackbar({ alert: false })
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
