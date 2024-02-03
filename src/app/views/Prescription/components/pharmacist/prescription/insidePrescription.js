import React, { useEffect, useState } from "react";
import HoverableText from "app/components/HoverableText";
import InsidePrescriptionRow from "./insidePrescriptionRow";
import DrugSwapModal from "./drugSwapModal";
import Previous from "./previous";
import ReplacementRow from "./replacementRow";
import { LoonsDialogBox } from "app/components/LoonsLabComponents";

const InsidePrescription = ({ classes, prescription, prescriptions, presDynamic, warehouse, setDynamic, setExchange, toOutside, pharmacy, showHistory, previous, setAltList }) => {

    const [swap, setSwap] = useState(null);
    const [originalDrug, setOriginalDrug] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [alts, setAlts] = useState([]);
    const [alradySwapedDialog, setAlradySwapedDialog] = useState(false);
    const [swapedSelectedDrugId, setSwapedSelectedDrugId] = useState(null);

    useEffect(() => {
        setAltList(alts);
    }, [alts])

    const allEqual = (arr, key) => {
        let firstNonNull = null;
        return arr.every((v) => {
            const value = v[key];
            if (value === null) {
                return true;
            }
            if (firstNonNull === null) {
                firstNonNull = value;
                return true;
            }
            return value === firstNonNull;
        });
    };

    const openSwap = (drug, status, sub_index) => {

        drug.pres_status = status;
        drug.drug_assign_id = prescription?.id;

        let selected_id = drug.id

        if (alts.filter((item) => (item.selected_id == selected_id && item.sub_index == sub_index)).length > 0) {
            setSwapedSelectedDrugId(selected_id)
            setAlradySwapedDialog(true)

        }


        setOriginalDrug(drug);
        setSelectedIndex(sub_index)
        if (allEqual(drug.AssignItems, "dosage")) {
            setSwap(drug);
        } else {
            let AssignItems = drug.AssignItems[sub_index]
            let tempDrug = { ...drug };
            tempDrug.AssignItems = [];
            tempDrug.AssignItems.push(AssignItems)
            setSwap(tempDrug);
        }

    }


    const resetDrugSwap = (selected_id) => {
        let newArr = alts.filter((item) => {
            if (item.selected_id == selected_id && (item.sub_index == selectedIndex || item.selected_index == selectedIndex)) {

            } else {
                return item
            }

        }
        )
        setAlts(newArr);
    }

    const setAlt = (drug, alt) => {
        console.log("swap select drug", drug)
        console.log("swap select alts", alt)

        const drugs = alt.filter((item) => item.sr_no !== drug.ItemSnap.sr_no);
        const altList = [];
        alt.forEach((obj) => {
            if (obj.selected) {
                altList.push(obj);
            }
        });
        drugs.push({
            sr_no: drug.ItemSnap.sr_no,
            selected_id: altList[0].selected_id,
            sub_index: selectedIndex,
            replacement: altList
        });

        let newArr = alts.concat(drugs)
        console.log("swap select final drugs", newArr);
        setAlts(newArr);
    }

    const renderAlt = (drug, master) => {
        //const alted = alts.filter((item) => item.sr_no === drug.ItemSnap.sr_no);
        const alted = alts.filter((item) => (item.selected_id === drug.id && item.sr_no === drug.ItemSnap.sr_no));
        console.log("render Alt drug alted", alted)
        console.log("render Alt drug alt", alts)
        console.log("render Alt drug", drug)
        if (alted.length > 0) {

            return <div>

                {
                    alted.map((altItem) => {
                        return (
                            altItem.replacement.map((rep, index) => <ReplacementRow classes={classes} item={{
                                index: `${master + 1}.${index + 1}`,
                                name: rep.ItemSnap.medium_description,
                                dosage: `${rep.dose} ${rep.ItemSnap?.DisplayUnit?.name}`,
                                frequency: rep.frequency,
                                duration: rep.duration,
                                quantity: rep.sel_quantity
                            }} />
                            )
                        )
                    })
                }
            </div>

        } else {
            return null;
        }
    }

    return <div>
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 4 }}>
                <div className={[classes.horizontal, classes.top].join(' ')}>
                    <div className={[classes.min, classes.header].join(' ')}>#</div>
                    <div className={[classes.min, classes.header].join(' ')}></div>
                    <div className={[classes.max, classes.header].join(' ')}><HoverableText bolded text="Item Name" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Dose" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Frequency" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Duration" /></div>
                    {/* <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Remainder" /></div> */}
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Suggested Qty" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text={prescription.status === "ISSUED" ? "Issued" : "Qty"} /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Action" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="My Stock" /></div>
                    <div className={[classes.medium, classes.header].join(' ')}><HoverableText bolded text="Store" /></div>
                </div>
                {prescription && prescription.insides.length > 0 ? prescription.insides.map((drug, index) => <>
                    <InsidePrescriptionRow
                        classes={classes}
                        prescription={prescription}
                        presDynamic={presDynamic}
                        warehouse={warehouse}
                        setDynamic={setDynamic}
                        setExchange={setExchange}
                        drug={drug}
                        index={index}
                        toOutside={toOutside}
                        openSwap={openSwap}
                        //disabled={(alts.filter((item) => item.sr_no === drug.ItemSnap.sr_no)).length > 0}
                        //disabled={(alts.filter((item) => item.selected_id === drug.id)).length > 0}
                        disabled={((alts.filter((item) => item.selected_id === drug.id)).length > 0)}
                        disabledSubItem={(alts.filter((item) => item.selected_id === drug.id).map(x => x.selected_index))}
                        previous={previous}
                    />
                    {renderAlt(drug, index)}
                </>) : null}
            </div>
            {showHistory && prescriptions && prescriptions.length > 0 ? <div style={{ flex: 1, marginLeft: '1em' }}>
                <Previous prescription={previous} page={1} />
            </div> : null}
        </div>
        {swap ? <DrugSwapModal open={swap} originalDrug={originalDrug} selectedIndex={selectedIndex} setOpen={setSwap} classes={classes} warehouse={warehouse} pharmacy={pharmacy} setAlt={setAlt} /> : null}


        <LoonsDialogBox
            title="Alrady Swaped Drug"
            show_alert={true}
            alert_severity="info"
            alert_message={"The Selected Drug is Alrady Swaped. Do You Want to Clear and Swap Again"}
            // message="testing 2"
            open={alradySwapedDialog}
            //open={true}
            show_button={true}
            show_second_button={true}
            btn_label="No"
            onClose={() => {
                setAlradySwapedDialog(false)
                setSwap(null)
            }}
            second_btn_label="Yes Swap Again"
            secondButtonAction={() => {
                resetDrugSwap(swapedSelectedDrugId)
                setAlradySwapedDialog(false)
            }}

        >

        </LoonsDialogBox>

    </div>
}

export default InsidePrescription;