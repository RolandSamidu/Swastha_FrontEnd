import React, { useState, useContext, useEffect } from 'react'
import {
    Grid,
    FormControl,
} from '@material-ui/core'
import Button from 'app/components/LoonsLabComponents/Button'
import { MainContainer, SubTitle, LoonsSnackbar, PrintHandleBar } from 'app/components/LoonsLabComponents'
import { PageContext } from '../PageContext'
import RichTextEditor from 'react-rte';
import { dateParse } from 'utils'
import SPCServices from 'app/services/SPCServices'
import { isUndefined } from 'lodash'
import { ConfirmationDialog } from 'app/components'



export default function Conditions({ POData }) {
    const [pageData, setPageData] = useContext(PageContext)
    const [condition, setCondition] = useState(RichTextEditor.createEmptyValue())
    const [conditionID, setConditionID] = useState(null);
    const [conditionType, setConditionType] = useState(null);
    const [saving, setSaving] = useState(false)
    const [resetOpen, setResetOpen] = useState(false)

    const foreign_conditions = async (orderNo, indentNo, srNo) => {
        try {
            let res = await SPCServices.getAllConditions({ type: 'SPC PO Foreign Shipment' })
            const { data } = res.data.view
            const conditionsHTML = data?.[0]?.conditions ? data?.[0]?.conditions : '<div></div>'
            const conditionId = data?.[0]?.id ? data?.[0]?.id : null
            const conditionType = data?.[0]?.typr ? data?.[0]?.type : null

            const formattedConditionsHTML = conditionsHTML
                .replace('${orderNo}', orderNo)
                .replace('${srNo}', srNo)
                .replace('${indentNo}', indentNo);

            return { condition: formattedConditionsHTML, id: conditionId, type: conditionType };
        } catch (err) {
            console.log("Error: ", err)
            return { condition: '<div></div>', id: null, type: null };
        }
    }

    const local_conditions = async (manufacture, tenderNo, date) => {
        try {
            let res = await SPCServices.getAllConditions({ type: 'SPC PO Local Shipment' })
            const { data } = res.data.view
            const conditionHTML = data?.[0]?.conditions ? data?.[0]?.conditions : '<div></div>'
            const conditionId = data?.[0]?.id ? data?.[0]?.id : null
            const conditionType = data?.[0]?.type ? data?.[0]?.type : null

            const formattedConditionsHTML = conditionHTML
                .replace('${supplier}', manufacture)
                .replace('${tenderNo}', tenderNo)
                .replace('OF ${date}', '');

            return { condition: formattedConditionsHTML, id: conditionId, type: conditionType };
        } catch (err) {
            console.log("Error: ", err)
            return { condition: '<div></div>', id: null, type: null };
        }
    }

    const callForeignConditions = async () => {
        const orderNo = POData.current?.intend?.orderNo || "";
        const intentNo = POData.current?.intend?.intentNo || "";
        const itemsDetails = Array.isArray(POData.current?.ItemsDetails) && POData.current?.ItemsDetails.length > 0 ? POData.current?.ItemsDetails.length === 1 ? POData.current?.ItemsDetails?.[0]?.rowData?.ItemSnap?.sr_no : "As per the Indent" : "";

        const { condition, type, id } = await foreign_conditions(orderNo, intentNo, itemsDetails);

        setCondition(RichTextEditor.createValueFromString(condition, 'html'));
        setConditionID(id);
        setConditionType(type);
    };

    const callLocalConditions = async () => {
        const itemManuacture = Array.isArray(POData.current?.ItemsDetails) && POData.current?.ItemsDetails.length > 0 ? POData.current?.ItemsDetails.length === 1 ? POData.current?.ItemsDetails?.[0]?.itemData?.manufacture?.name : "As per above Purchase Order" : "";

        const tenderNo = POData.current?.intend?.tenderNo || "";
        const currentDate = dateParse(new Date());

        const { condition, id, type } = await local_conditions(itemManuacture, tenderNo, currentDate);

        setCondition(RichTextEditor.createValueFromString(condition, 'html'));
        setConditionID(id);
        setConditionType(type);
    };

    // useEffect(() => {
    //     if (POData.current?.intend?.orderNo && POData.current?.intend?.intentNo && POData.current?.ItemsDetails) {
    //         callForeignConditions();
    //     }
    // }, [POData.current?.intend, POData.current?.ItemsDetails]);

    // useEffect(() => {
    //     if (POData.current?.intend?.suppplierDetails && POData.current?.intend?.tenderNo) {
    //         callLocalConditions();
    //     }
    // }, [POData.current?.intend]);

    useEffect(() => {
        const loadData = async () => {
            if (POData.current.shipping_conditions) {
                setCondition(RichTextEditor.createValueFromString(POData.current.shipping_conditions?.condition, 'html'))
                setConditionID(POData.current.shipping_conditions?.id)
                setConditionType(POData.current.shipping_conditions?.type)
            } else {
                if (POData.current.intend.POType === 'F') {
                    callForeignConditions()
                } else if (pageData.category !== "Pharmaceutical" && POData.current.intend.POType === 'L') {
                    callLocalConditions()
                }
            }
        }

        loadData();
    }, [])

    const handleChange = (newValue) => {
        setCondition(newValue);
    }

    const saveData = () => {
        POData.current.shipping_conditions = { condition: condition.toString('html'), id: conditionID, type: conditionType }
    }

    const updateData = () => {
        saveData()
        setSaving(true)
    }

    const handleNext = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 6 }
        setPageData(tempPageData)
    }
    const handleBack = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 4 }
        setPageData(tempPageData)
    }

    return (
        <MainContainer>
            <Grid
                container
                spacing={2}
                style={{ display: 'flex', justifyContent: 'center' }}
            >

                {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updateData}
                        disabled={pageData.isPosted}
                    >
                        save
                    </Button>
                </Grid> */}

                <Grid item xs={12}>
                    <FormControl className="w-full">
                        <SubTitle title="Condtions" />
                        <br />
                        <RichTextEditor disabled={pageData.isPosted} value={condition} onChange={handleChange} editorClassName='custom-editor' />
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
                            <Button
                                className='mr-2 mt-2'
                                startIcon='refresh'
                                variant="contained"
                                // color="primary"
                                style={{
                                    backgroundColor: "#008080"
                                }}
                                onClick={() => setResetOpen(true)}
                            >
                                Refresh
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
            <ConfirmationDialog
                text={"Are you sure to Reset the Logistic Condition"}
                open={resetOpen}
                onConfirmDialogClose={() => { setResetOpen(false) }}
                onYesClick={() => {
                    setResetOpen(false);
                    console.log("Data: ", condition.toString('html'))
                    if (POData.current.intend.POType === 'F') {
                        callForeignConditions()
                    } else if (pageData.category !== "Pharmaceutical" && POData.current.intend.POType === 'L') {
                        callLocalConditions()
                    } else {
                        setSaving(true)
                    }
                }}
            />
            <LoonsSnackbar
                open={saving}
                onClose={() => {
                    setSaving(false)
                }}
                message="Sorry, No default condition exists for Pharmaceutical and PO Type Local"
                autoHideDuration={1200}
                severity='info'
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </MainContainer>
    )
}
