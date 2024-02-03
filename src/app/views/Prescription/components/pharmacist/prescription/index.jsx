import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, Widget } from "app/components/LoonsLabComponents";
import { Button, FormControl, MenuItem, Select, Snackbar, TextField, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LoonsButton from "app/components/LoonsLabComponents/Button";
import PrescriptionService from "app/services/PrescriptionService";
import HoverableText from "app/components/HoverableText";
import PatientServices from "app/services/PatientServices";
import { Alert, CircularProgress } from "@mui/material";
import WarehouseServices from "app/services/WarehouseServices";
import PharmacyService from "app/services/PharmacyService";
import { dateParse, dateTimeParse } from "utils";
import DiscardModal from "./discardModal";
import PatientSummary from "./patientSummary";
import PrescriptionList from "./prescriptionList";
import RequestExchangeModal from "./requestExchangeModal";
import InsidePrescription from "./insidePrescription";
import OutsidePrescription from "./outsidePrescription";
import localStorageService from "app/services/localStorageService";

const styleSheet = ((palette, ...theme) => ({
    padded: {
        paddingTop: '20px',
        paddingBottom: '20px',
    },
    centered: {
        justifyContent: 'center'
    },
    horizontal: {
        display: 'flex',
    },
    horizontalSub: {
        display: 'flex',
        width: '100%'
    },
    betweenAligned: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    leftAligned: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end'
    },
    header: {
        background: '#F2F2F2',
        borderLeft: '0.5px solid #DFDFDF',
        borderRight: '0.5px solid #DFDFDF',
        borderTop: '1px solid #DFDFDF',
        borderBottom: '1px solid #DFDFDF',
        textAlign: 'center',
        //paddingTop: '0.5em',
        //paddingBottom: '0.5em',
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    oddRow: {
        background: '#F2F2F2',
        border: '0.5px solid #DFDFDF',
        textAlign: 'center',
        //paddingTop: '0.5em',
        //paddingBottom: '0.5em',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    evenRow: {
        background: 'white',
        border: '0.5px solid #DFDFDF',
        textAlign: 'center',
        //paddingTop: '0.5em',
        //paddingBottom: '0.5em',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    top: {
        marginTop: '1em'
    },
    noBorder: {
        border: 'none'
    },
    min: {
        width: 'calc(100%/26)',
    },
    medium: {
        width: 'calc(100%/8)'
    },
    max: {
        width: 'calc(200%/4)'
    },
    disabled: {
        background: '#f9b3b3'
    }
}));

class PharmacistPrescription extends Component {
    constructor(props) {
        super(props)
        this.toInside = this.toInside.bind(this);
        this.toOutside = this.toOutside.bind(this);
        this.showDiscardSuccess = this.showDiscardSuccess.bind(this);
        this.setAlts = this.setAlts.bind(this);
        this.state = {
            clinic: {
                color: '#DDC6F4',
                fontColor: '#044e63'
            },
            prescription: null,
            patient: null,
            prescriptions: null,
            columns: [
                {
                    name: 'id',
                    label: '#',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'stage',
                    label: '',
                    options: {
                        display: true,
                        customBodyRender: (val) => <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {val === 0 ? <AddIcon style={{ color: '#00efa7' }} /> : (val === 1 ? <ArrowUpwardIcon style={{ color: '#00cbff' }} /> : <ArrowDownwardIcon style={{ color: '#ff005d' }} />)}
                        </div>
                    },
                },
                {
                    name: 'name',
                    label: 'Item Name',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'frequency',
                    label: 'Frequency',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'dosage',
                    label: 'Dosage',
                    options: {
                        display: true,
                        customBodyRender: (val) => <FormControl size="small" style={{ width: '100%' }}>
                            <Select variant="outlined">
                                <MenuItem value={10}>10 mg</MenuItem>
                                <MenuItem value={10}>20 mg</MenuItem>
                            </Select>
                        </FormControl>
                    },
                },
                {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'quantity',
                    label: 'Qty',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'packSize',
                    label: 'Pack Size',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'reminder',
                    label: 'Reminder from Previous Prescriptions',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'issueQty',
                    label: 'Suggested Issue Quantity',
                    options: {
                        display: true,
                        customBodyRender: (val) => <TextField variant="outlined" size="small" />
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (val) => (val === 'Issue' ?
                            <Button variant="contained" style={{ background: '#00cbff', color: 'white', width: '100%' }}>{val}</Button> :
                            <Button variant="contained" style={{ background: '#ff005d', color: 'white', width: '100%' }} onClick={() => this.setState({ exchangeRequest: null })}>{val}</Button>)
                    },
                },
                {
                    name: 'pharmacistRemark',
                    label: 'Pharmacist Remark',
                    options: {
                        display: true,
                        customBodyRender: (val) => <TextField variant="outlined" size="small" placeholder={val} />
                    },
                },
                {
                    name: 'doctorsRemark',
                    label: `Doctor's Remark`,
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'myStock',
                    label: 'My Stock',
                    options: {
                        display: true,
                    },
                },
            ],
            data: [],
            outData: [],
            warehouse: null,
            pharmacy: null,
            exchangeRequest: null,
            viewSnack: "",
            snackType: "",
            isLoading: false,
            showHistory: false,
            severity: "success",
            previous: null,
            alts: [],
            loadingPrescription: false
        }
    }

    setAlts(arr) {
        this.setState({ alts: [...arr] })
    }

    reorganizeDrugs(objs) {
        if (this.state.prescription) {
            const inside = [];
            const outside = [];
            const rows = this.state.prescription.rows;
            for (let i = 0; i < rows.length; i++) {
                const details = objs.filter((item) => item.drug === rows[i].drug_id);
                const row = rows[i];
                row.stock = null;
                row.pack = null;
                row.main_warehouse_quantity = null;
                if (details.length > 0) {
                    if (details[0].stock && parseInt(details[0].stock) > 0) {
                        row.stock = details[0].stock;
                        row.pack = details[0].pack;
                        row.main_warehouse_quantity = details[0].main_warehouse_quantity ?? 0;
                        inside.push(row);
                    } else {
                        row.stock = 0;
                        row.pack = 0;
                        outside.push(row);
                    }
                } else {
                    outside.push(row);
                }
            }
            const pres = this.state.prescription;
            pres.rows = inside;
            pres.outRows = outside;
            this.setState({ prescription: pres });
        }
    }

    toInside(item) {
        const inside = this.state.prescription.insides;
        //const outside = this.state.prescription.outsides.filter((drg) => drg.drug_id !== item.drug_id);
        var outside = this.state.prescription.outsides;
        outside.splice(outside.indexOf(item), 1)
        inside.push(item);
        const pres = this.state.prescription;
        pres.outsides = outside;
        pres.insides = inside;
        this.setState({ viewSnack: "Marking out-stock item as in-stock", severity: "success", prescription: pres });
    }

    toOutside(item) {
        //const inside = this.state.prescription.insides.filter((drg) => drg.id !== item.id);
        const outside = this.state.prescription.outsides;
        var inside = this.state.prescription.insides
        inside.splice(inside.indexOf(item), 1)

        outside.push(item);
        const pres = this.state.prescription;
        pres.outsides = outside;
        pres.insides = inside;
        this.setState({ viewSnack: "Marking in-stock item as out-stock", severity: "error", prescription: pres });
    }

    async changePrescription(selected, pos) {
        if (selected) {
            this.setState({ prescription: null });
            const pres = await PrescriptionService.fetchPrescription({
                'order[0]': ['createdAt', 'DESC'],
                'limit': 1
            }, selected.id.toString());
            const drugIds = [];
            const prescription = pres.data.view;
            prescription.DrugAssign.forEach((drug) => {
                if (drugIds.indexOf(drug.drug_id) === -1) {
                    drugIds.push(drug.drug_id);
                }
            });
            const whuser = await WarehouseServices.getWareHouseUsers({
                'main_or_personal': 'Personal',
                'employee_id': JSON.parse(localStorage.getItem('userInfo')).id,
            });

            console.log("warehose", whuser)
            console.log("PRESC", prescription);
            const warehouse = whuser.data.view.data[0]?.warehouse_id;
            const pharmacy = whuser.data.view.data[0]?.Warehouse.pharmacy_drugs_store_id;
            const stock_out = await PharmacyService.getDrugStocks({
                "warehouse_id": warehouse,
                "items": drugIds,
                "zero_needed": true,
                main_needed: true,
                pharmacy_drugs_store_id: pharmacy
            });
            const stock_store = await PharmacyService.getDrugStocks({
                "items": drugIds,
                "zero_needed": true,
                all_pharmacy: true,
                pharmacy_drugs_store_id: pharmacy
            });
            let insides = [];
            let outsides = prescription.DrugAssign;
            let stks = [];
            if (stock_out.data && stock_out.data.posted && stock_out.data.posted.data) {
                stks = stock_out.data.posted.data;
            }

            //choxmi added
            let stksall = [];
            if (stock_store.data && stock_store.data.posted && stock_store.data.posted.data) {
                stksall = stock_store.data.posted.data;
            }

            prescription.DrugAssign.forEach((drug, index) => {
                const stkTemp = stks.filter((itm) => itm.item_id === drug.drug_id)
                const stk = stkTemp.length > 0 ? stkTemp[0] : null;
                //choxmi added
                const stkallTemp = stksall.filter((itm) => itm.item_id === drug.drug_id)
                const stkall = stkallTemp.length > 0 ? stkallTemp[0] : null;


                // if (stk && stk.quantity > 0) {
                prescription.DrugAssign[index].my_stock = stk?.quantity ? stk?.quantity.toString() : "0";
                prescription.DrugAssign[index].personal_warehouse_id = stk?.personal_warehouse_id ?? warehouse;
                prescription.DrugAssign[index].store = stk?.main_warehouse_quantity ? stk?.main_warehouse_quantity.toString() : "0";
                prescription.DrugAssign[index].main_warehouse_id = stk?.main_warehouse_id ?? warehouse;

                //choxmi added
                prescription.DrugAssign[index].other_stock = stkall?.quantity ? stkall.quantity.toString() : "0";

                if (drug.type !== "OS") {
                    // if (Number(prescription.DrugAssign[index].my_stock) > Number(drug.quantity) || Number(prescription.DrugAssign[index].store) > Number(drug.quantity)) {
                    insides.push(prescription.DrugAssign[index]);
                    const temp = outsides.filter((item) => item.drug_id !== drug.drug_id);
                    outsides = temp;
                    // }
                } else if (Number(prescription.DrugAssign[index].my_stock) > Number(drug.quantity) || Number(prescription.DrugAssign[index].store) > Number(drug.quantity)) {
                    insides.push(prescription.DrugAssign[index]);
                    const temp = outsides.filter((item) => item.drug_id !== drug.drug_id);
                    outsides = temp;
                }
                // } else {
                //     console.log("EMPTY QTY",stk);
                //     prescription.DrugAssign[index].my_stock = "0";
                //     prescription.DrugAssign[index].personal_warehouse_id = stk.personal_warehouse_id ?? warehouse;
                //     prescription.DrugAssign[index].store = "0";
                //     prescription.DrugAssign[index].main_warehouse_id = stk.main_warehouse_id ?? warehouse;
                // }
            })
            prescription.insides = insides;
            prescription.outsides = outsides;
            console.log("SETTING PREV", prescription, pos + 1, this.state.prescriptions[pos + 1]);
            let prevPres = this.state.prescriptions[pos + 1] ?? null;
            this.setState({ prescription: prescription, previous: prevPres, warehouse, pharmacy, loadingPrescription: true });
        }
    }

    async fetchPrescriptions() {
        this.setState({ loadingPrescription: false })
        /*   const params = new Proxy(new URLSearchParams(window.location.search), {
              get: (searchParams, prop) => searchParams.get(prop),
          });
   */
        let owner_id = await localStorageService.getItem('owner_id')

        PrescriptionService.fetchPrescriptions({
            'order[0]': ['createdAt', 'DESC'],
            'patient_id': this.props.patient_id,
            owner_id: owner_id,
            //'no_druglist': true,
            'limit': 6,
            //'from': dateParse(new Date().setMonth(new Date().getMonth() - 6)),
            //'to': dateParse(new Date().setDate(new Date().getDate() + 1))
        }).then((obj) => {
            const prescriptions = obj.data ? obj.data.view.data : [];
            this.changePrescription(prescriptions.length > 0 ? prescriptions[0] : null, 0);
            this.fetchPatient();

            this.setState({
                prescriptions: prescriptions,
                loadingPrescription: true
            });

        });
    }

    fetchPatient() {
        /*  const params = new Proxy(new URLSearchParams(window.location.search), {
             get: (searchParams, prop) => searchParams.get(prop),
         }); */
        PatientServices.getPatientById(this.props.patient_id).then((obj) => {
            if (obj.data && obj.data.view) {
                this.setState({
                    patient: obj.data.view
                })
            }
        });
    }

    allEqual(arr, key) {
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

    issuePrescription() {

        const { onFocus } = this.props

        console.log("issuving drugs", this.state.prescription);
        this.setState({ isLoading: true });
        const drugArr = [];
        let count = 0;
        let error_ = false;
        let q_check = true;
        let swap_error = false;
        this.state.prescription.insides.forEach((pres) => {
            console.log("all assignItems", pres.AssignItems)
            pres.AssignItems.forEach((item, index) => {
                if (!item.issuing) {
                    item.issuing = item.quantity;
                }
                let issuing_items = item.issuing;
                const main = {
                    "pharmacy_id": this.state.pharmacy,
                    "warehouse_id": (Number(item.issuing) <= Number(pres.my_stock)) ? pres.personal_warehouse_id : ((Number(item.issuing) <= Number(pres.store)) ? pres.main_warehouse_id : pres.personal_warehouse_id),
                    "frequency_id": item.frequency_id,
                    "issuer_id": JSON.parse(localStorage.getItem('userInfo')).id,
                    "prescription_drug_assign_item_id": item.id,
                    "drug_assign_id": pres.id,
                    "date": new Date().toISOString(),
                    "owner_id": item.owner_id,
                    "item_id": pres.drug_id,
                    "drug_name": pres.drug_name,
                    "issuer_remark": "",
                    "prescription_remark_issuer": "",
                    "quantity": item.issuing,
                    "duration": item.duration,
                    "frequency": item.frequency,
                    "dosage": item.dosage
                };
                const alted = this.state.alts.filter((item) => (item.selected_id === pres.id && item.sr_no === pres.ItemSnap.sr_no));
                console.log("issuving drugs alted", alted);
                console.log("all assignItems 2", alted)

                if (alted.length > 0) {

                    if ((pres.AssignItems.length != alted.length) && !this.allEqual(pres.AssignItems, "dosage")) {
                        swap_error = true;
                    }
                    main.quantity = 0;
                    drugArr.push(main);
                    alted.forEach((altItem) => {
                        altItem.replacement.forEach((altz) => {
                            if (altz.selected_index == index) {
                                drugArr.push({
                                    "pharmacy_id": this.state.pharmacy,
                                    //"warehouse_id": (Number(item.issuing) <= Number(pres.my_stock)) ? pres.personal_warehouse_id : ((Number(item.issuing) <= Number(pres.store)) ? pres.main_warehouse_id : pres.personal_warehouse_id),
                                    "warehouse_id": (Number(altz.sel_quantity) <= Number(altz.my_quantity)) ? altz.personal_warehouse_id : ((Number(altz.sel_quantity) <= Number(altz.main_warehouse_quantity)) ? altz.main_warehouse_id : altz.personal_warehouse_id),
                                    
                                    "frequency_id": item.frequency_id,
                                    "issuer_id": JSON.parse(localStorage.getItem('userInfo')).id,
                                    "prescription_drug_assign_item_id": item.id,
                                    "drug_assign_id": pres.id,
                                    "date": new Date().toISOString(),
                                    "owner_id": item.owner_id,
                                    "item_id": altz.item_id,
                                    "drug_name": altz.ItemSnap.medium_description,
                                    "issuer_remark": "",
                                    "prescription_remark_issuer": "",
                                    "quantity": altz.sel_quantity,
                                    "duration": item.duration,
                                    "frequency": item.frequency,
                                    "dosage": altz.dose
                                });
                                issuing_items += altz.sel_quantity;
                            }

                        });
                    });
                } else {
                    drugArr.push(main);
                    if (Number(issuing_items) > Number(pres.my_stock) && Number(issuing_items) > Number(pres.store)) {
                        q_check = false;
                    }
                }

                console.log("pres item", alted)

                count++;
            });
        })

        if (!q_check) {
            this.setState({ viewSnack: "One or more lines contains out of stock items", isLoading: false, severity: "error", });
            return;
        }

        if (error_) {
            this.setState({ viewSnack: "Issuing quantity should be less than stock quantity", isLoading: false });
        } if (swap_error) {
            this.setState({ viewSnack: "Make Sure to Swap All Drugs in Swapped Drug", isLoading: false, severity: "error" });
        } else {

            console.log("submitting drug list", drugArr)

            PharmacyService.issuePrescription({
                "prescription_id": this.state.prescription.id,
                "drugAssignArray": drugArr
            })
                .then((out) => {
                    if (out.status == 201) {
                        this.setState({ viewSnack: "Prescription issue successful", severity: "success", isLoading: false });

                        if (this.props.from == "PatientPrescription") {
                            onFocus &&
                                onFocus({})
                        } else {
                            window.location.href = "/pharmacy/search/patients";
                        }

                    } else {
                        this.setState({ viewSnack: "Error occured", severity: "error", isLoading: false })
                    }

                })
                .catch((e) => this.setState({ viewSnack: "Error occured", severity: "error", isLoading: false }))
 

        }
    }

    showDiscardSuccess() {
        this.setState({ viewSnack: "Prescriprion referred", severity: "success", isLoading: false });
        setTimeout(() => window.location.href = "/pharmacy/search/patients", 1000);
    }

    componentDidMount() {
        this.fetchPrescriptions();

        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted ||
                (typeof window.performance != "undefined" &&
                    window.performance.navigation.type === 2);
            if (historyTraversal) {
                // Handle page restore.
                window.location.reload();
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.state.loadingPrescription && this.state.prescriptions && this.state.prescriptions.length > 0 ? <><PrescriptionList prescriptions={this.state.prescriptions}
                    setPrescription={(pres, pos) => this.changePrescription(pres, pos)} />
                    {this.state.prescription ? <><PatientSummary
                        prescription={this.state.prescription}
                        patient={this.state.patient}
                        clinicColor={this.state.clinic.color}
                        clinicFontColor={this.state.clinic.fontColor} />
                        <Fragment>
                            <MainContainer>
                                <InsidePrescription
                                    classes={classes}
                                    prescription={this.state.prescription}
                                    prescriptions={this.state.prescriptions}
                                    warehouse={this.state.warehouse}
                                    setExchange={(item) => this.setState({ exchangeRequest: item })}
                                    toOutside={this.toOutside}
                                    pharmacy={this.state.pharmacy}
                                    showHistory={this.state.showHistory}
                                    previous={this.state.previous}
                                    setAltList={this.setAlts}
                                />

                                <div className={classes.betweenAligned}>
                                    <div style={{ marginTop: 10 }}>
                                        <div className={classes.horizontal}>
                                            <AddIcon style={{ color: '#00efa7' }} /> - Newly added drug
                                        </div>
                                        <div className={classes.horizontal}>
                                            <ArrowUpwardIcon style={{ color: '#00cbff' }} /> - Drug quantity increased
                                        </div>
                                        <div className={classes.horizontal}>
                                            <ArrowDownwardIcon style={{ color: '#ff005d' }} /> - Drug quantity decreased
                                        </div>
                                    </div>
                                    <div className={classes.leftAligned}>
                                        <p>Last Updated : {dateTimeParse(this.state.prescription.latest_update_date_time)}</p>
                                        {this.state.prescription.status.toUpperCase() !== "ISSUED" && this.state.prescription.status.toUpperCase() !== "REJECTED" ?
                                            <div>
                                                {this.state.prescriptions && this.state.prescriptions.length > 1 ?
                                                    <LoonsButton color="secondary" size="small" style={{ marginRight: 10 }} onClick={() => this.setState({ showHistory: !this.state.showHistory })}>{this.state.showHistory ? "Hide" : "Show"} Previous Prescription</LoonsButton> : null}
                                                {this.state.prescription.status === "Pending" ? <LoonsButton color="primary" size="small" style={{ marginRight: 10 }} onClick={() => this.setState({ discard: true })}>Refer to the DR</LoonsButton> : null}
                                                <LoonsButton size="small" style={{ background: 'red', color: 'white' }} onClick={() => this.issuePrescription()}>Mark All as Issue</LoonsButton>
                                            </div> : null}
                                    </div>
                                </div>

                                <OutsidePrescription
                                    classes={classes}
                                    prescription={this.state.prescription}
                                    warehouse={this.state.warehouse}
                                    setExchange={(item) => this.setState({ exchangeRequest: item })}
                                    toInside={this.toInside}
                                />

                            </MainContainer>
                        </Fragment></> : <div style={{ minHeight: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>}</> : <div style={{ minHeight: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{this.state.prescriptions === null ? <CircularProgress /> : <h4>No Prescriptions found</h4>}</div>}
                <DiscardModal setOpen={(res) => this.setState({ discard: res })} open={this.state.discard} prescription={this.state.prescription} showSuccess={this.showDiscardSuccess} />
                {this.state.exchangeRequest ? <RequestExchangeModal setOpen={(res) => this.setState({ exchangeRequest: res })} open={this.state.exchangeRequest} setMsg={(msg) => this.setState({ viewSnack: msg })} pharmacy={this.state.pharmacy} warehouse={this.state.warehouse} /> : null}
                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={this.state.viewSnack} autoHideDuration={3000} onClose={() => this.setState({ viewSnack: "" })}>
                    <Alert onClose={() => this.setState({ viewSnack: "" })} severity={this.state.severity} variant="filled" sx={{ width: '100%' }}>
                        {this.state.viewSnack}
                    </Alert>
                </Snackbar>
            </div >
        );
    }
}

export default withStyles(styleSheet)(PharmacistPrescription);