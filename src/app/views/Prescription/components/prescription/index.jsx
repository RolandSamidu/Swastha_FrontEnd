import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { MainContainer, Widget } from 'app/components/LoonsLabComponents';
import Previous from './previous';
import { CircularProgress, Grid } from '@material-ui/core';
import Latest from './latest';
import Bookmarks from 'app/components/LoonsLabComponents/Bookmarks';
import { useState } from 'react';
import PrescriptionService from 'app/services/PrescriptionService';
import { SnackbarProvider } from 'notistack';
import PatientInfo from './latest/PatientInfo';
import PatientDetails from '../pharmacist/PatientDetails';
import Allergies from './latest/Allergies';
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput';
import localStorageService from 'app/services/localStorageService';
import PatientServices from 'app/services/PatientServices'
import UtilityServices from "app/services/UtilityServices";
import ExaminationServices from 'app/services/ExaminationServices';
import WarehouseServices from 'app/services/WarehouseServices';
import { merge } from 'lodash'
import InventoryService from 'app/services/InventoryService';
import PharmacyService from 'app/services/PharmacyService';

const styles = {
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
}

const Prescription = (props) => {

    console.log("props", props)
    const { classes } = props;
    const [loadFromCloud, setLoadFromCloud] = useState(props.loadFromCloud);

    const [history, setHistory] = useState([]);

    const [clinics, setClinics] = useState([]);
    const [frequencies, setFrequencies] = useState([]);

    var [clinic, setClinic] = useState(null);
    const [patientClinic, setPatientClinic] = useState(null);

    const [warehouses, setWarehouses] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [latest, setLatest] = useState(null);
    const [patientInfo, setPatientInfo] = useState(null);
    const [favouritesItems, setFavouritesItems] = useState(null);
    const [allergedrugList, setAllergeDrugList] = useState([]);
    const [historyPage, setHistoryPage] = useState(1);

    //setLoadFromCloud(props.loadFromCloud);

    const fetchClinics = () => {

        PrescriptionService.fetchPatientClinics({ 'type': ['Clinic','OPD'], 'patient_id': window.dashboardVariables.patient_id }).then((obj) => {
            if (obj.data) {

                console.log("patient Clinics", obj.data.view.data)
                const clinics = obj.data.view.data.map((clinic) => ({
                    id: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.short_reference : 'N/A',
                    name: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.name : 'N/A',
                    clinic_id: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.id : 'N/A',
                    consultant: clinic.Employee?.name ? clinic.Employee.name : "",
                    hospital_id: clinic.hospital_id,
                    owner_id: clinic.owner_id,
                    hospital_name: "",
                    hospital_view: false,
                }));
                // console.log("filterd clinic",obj.data.view.data.filter((value) => value.clinic_id == window.dashboardVariables.clinic_id)[0].Employee.name)
                setClinics(clinics);
                if (clinics.length > 0) {
                    ///console.log("selected clinic",clinics)
                    let Selected_clinic = clinics.filter((value) => value.clinic_id == window.dashboardVariables.clinic_id)
                    setClinic(Selected_clinic[0]);
                    setPatientClinic(Selected_clinic[0])
                    console.log("filterd clinic", Selected_clinic)
                    //setClinic(clinics[0]);
                }
            }
        });


    }




    const fetchWarehouse = async () => {
        let owner_id = await localStorageService.getItem("owner_id");
        let clinic_id = window.dashboardVariables.clinic_id;

        let warehouses = []
        let pharmacies = []
        WarehouseServices.getAllWarehousewithOwner({ clinic_id: clinic_id }, owner_id).then((obj) => {
            if (obj.data) {
                obj.data.view.data.forEach(element => {
                    if (!warehouses.includes(element.id)) {
                        warehouses.push(element.id)
                    }
                    if (!pharmacies.includes(element.pharmacy_drugs_store_id)) {
                        pharmacies.push(element.pharmacy_drugs_store_id)
                    }
                });

                setWarehouses(warehouses);
                setPharmacies(pharmacies);

            }
        });
    }
    const fetchFrequencies = () => {
        PrescriptionService.fetchFrequencies({}).then((obj) => {
            if (obj.data) {
                const out = obj.data.view.data.map((fr) => ({
                    id: fr.id,
                    title: fr.name,
                    value: fr.value
                }));
                setFrequencies(out);
            }
        });
    }

    const fetchPatientInfo = async () => {
        PatientServices.getPatientById(window.dashboardVariables.patient_id, {}).then(async (obj) => {
            if (obj.status == 200) {

                var age = await UtilityServices.getAge(obj.data.view.date_of_birth);
                //return age.age_years + 'Y ' + age.age_months + 'M ' + age.age_days + 'D ';
                let data = obj.data.view;
                data.age = age.age_years + 'Y ' + age.age_months + 'M ' + age.age_days + 'D ';
                console.log("patient info", data)
                setPatientInfo(data);

            }
        });
    }

    const getFavItem = (pres) => {
        const date = new Date();
        console.log("fav drug list12", pres)
        return {
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            drugs: pres.map((drug) => {
                return {
                    drug_id: drug.drug_id,
                    type: '',
                    route: drug.ItemSnap && drug.ItemSnap.DefaultRoute ? drug.ItemSnap.DefaultRoute.name : 'Oral',
                    drug: drug.drug_name,
                    sr_no: drug.ItemSnap?.sr_no,
                    short_name: drug.ItemSnap ? drug.ItemSnap.short_description : drug.drug_name,
                    uom: drug.ItemSnap && drug.ItemSnap.DisplayUnit?.name && drug.ItemSnap.DisplayUnit?.name ? drug.ItemSnap.DisplayUnit?.name : "mg",
                    quantity: drug.quantity,
                    strength: drug.ItemSnap?.item_unit_size,
                    issued_quantity: drug.issued_quantity,
                    params: drug.AssignItems ? drug.AssignItems.map((param) => {
                        return {
                            frequency: param.frequency,
                            frequency_val: param.DefaultFrequency.value,
                            frequency_id: param.frequency_id,
                            duration: param.duration,
                            dosage: param.dosage, 
                            remark: param.doctor_remark ?? null,
                            quantity: param.quantity ?? 0,
                            strength: drug.ItemSnap?.item_unit_size,
                        }
                    }) : []
                }
            })
        }
    }

    const getPresItem = (pres) => {
        const date = new Date(pres.createdAt);
        return {
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            doctor: pres.Doctor,
            drugs: pres.DrugAssign.map((drug) => {
                console.log("PREZON", drug);
                return {
                    drug_id: drug.drug_id,
                    type: '',
                    route: drug.ItemSnap && drug.ItemSnap.DefaultRoute ? drug.ItemSnap.DefaultRoute.name : 'Oral',
                    drug: drug.drug_name,
                    short_name: drug.ItemSnap ? drug.ItemSnap.short_description : drug.drug_name,
                    sr_no: drug.ItemSnap?.sr_no,
                    uom: drug.ItemSnap && drug.ItemSnap.DisplayUnit?.name && drug.ItemSnap.DisplayUnit?.name ? drug.ItemSnap.DisplayUnit?.name : "mg",
                    quantity: drug.quantity,
                    issued_quantity: drug.issued_quantity,
                    strength: drug.ItemSnap?.item_unit_size,
                    params: drug.AssignItems ? drug.AssignItems.map((param) => {
                        console.log("PREZON 123", param);
                        return {
                            frequency: param.frequency,
                            frequency_id: param.frequency_id,
                            frequency_val: param.DefaultFrequency.value,
                            duration: param.duration,
                            dosage: param.dosage,
                            remark: param.doctor_remark ?? null,
                            quantity: param.quantity ?? 0,
                            strength: drug.ItemSnap?.item_unit_size,
                        }
                    }) : []
                }
            })
        }
    }

    const fetchFav = async () => {

        var user = await localStorageService.getItem('userInfo');
        var doctor_id = user.id;
        console.log("user", user)
        PrescriptionService.fetchFavourites({ clinic_id: window.dashboardVariables.clinic_id,  doctor_id: doctor_id })
            .then((favOut) => {
                if (favOut.data && favOut.data.view && favOut.data.view.data) {
                    const favs = favOut.data.view.data.map((fav) => { return { label: fav.name, value: fav.id } });
                    setFavourites(favs);
                }
            });
    }

    const fetchFavItem = (obj) => {
        if (obj) {
            let drugList = null;
            if (obj.length == 0) {
                setFavouritesItems({ date: null, drugs: [] })
            }

            obj.forEach(element => {
                PrescriptionService.fetchFavourite({ prescription_id: element.value })
                    .then((favOut) => {
                        if (favOut.data.view.data) {
                            const obj = favOut.data.view.data;
                            let newob = getFavItem(obj)
                            if (drugList == null) {
                                drugList = newob;
                                console.log("fev obj3", newob)
                                setFavouritesItems(newob)
                            } else {
                                newob.drugs = [...newob.drugs, ...drugList.drugs]
                                console.log("fev obj4", newob)
                                setFavouritesItems(newob)
                            }

                        }
                    });
            });

        }
    }

    const fetchHistory = (pos) => {
        if (pos > 0) {

            setHistoryPage(pos);

            PrescriptionService.fetchPrescriptions({
                'order[0]': ['createdAt', 'DESC'],
                'patient_id': window.dashboardVariables.patient_id,
                'clinic_id': clinic.clinic_id,
                //'clinic_id': clinic.clinic_id,
                'limit': historyPage === 1 ? 4 : 3,
                'page': pos - 1
            }).then((obj) => {
                const prescriptions = obj.data ? obj.data.view.data.map((pres) => getPresItem(pres)) : [];
                if (prescriptions.length > 0) {
                    setHistory(prescriptions);

                } else {

                    setHistory([]);
                    setHistoryPage(1);
                }
            });


        }
    }

    const getAllergies = async () => {
        let params = {
            patient_id: window.dashboardVariables.patient_id,
            //widget_input_id: this.props.itemId,
            //'question[0]':'problems',
            question: ['Drug Allergies'],
            //limit: 20
        }
        let res;
        if (props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            let items_ids = [];
            res.data.view.data.forEach(element => {
                items_ids.push(element.other_answers.id)
            });
            console.log("Allergies", res.data.view.data)
            //let drugs_ids = res.data.view?.data.map(a => a.id);
            let allergies_params = { item_id: items_ids, check_virtual: true }
            if (items_ids.length > 0) {
                let res2 = await InventoryService.fetchAllItems(allergies_params)
                console.log("Allergies virtual items", res2.data.view.data)

                let aa = [];
                res2.data.view.data.forEach(element => {
                    if (element.VirtualItem?.ItemSnaps) {
                        element.VirtualItem.ItemSnaps.forEach(element_two => {
                            aa.push(element_two)
                        });
                    }
                });

                /*   res.data.view.data.forEach(element => {
                      aa.push(element.other_answers)
                  }); */
                setAllergeDrugList(aa)

            }
        }
    }

    useEffect(() => {
        fetchFrequencies();
        fetchFav();
        getAllergies()
        fetchPatientInfo()
        fetchWarehouse()
    }, []);

    useEffect(() => {
        fetchClinics();
    }, [frequencies]);

    useEffect(() => {
        if (props.loadFromCloud) {
            //window.location.href = `/ehrdata/${window.dashboardVariables.patient_id}`
            window.open( `/ehrdata/${window.dashboardVariables.patient_id}`, "_blank")
        }
        // fetchClinics();
        //getPrescriptions()
    }, [props.loadFromCloud]);


    const getPrescriptions = async () => {
        console.log("window clinic id", window.dashboardVariables.clinic_id)

        if (clinic) {
            console.log("window clinic id", "ok")

            PrescriptionService.fetchPrescriptions({
                'order[0]': ['createdAt', 'DESC'],
                'patient_id': window.dashboardVariables.patient_id,
                'clinic_id': clinic.clinic_id,
                //'clinic_id': clinic.clinic_id,
                'limit': 1,
                'page': 0
            }).then((obj) => {
                const prescriptions = obj.data ? obj.data.view.data.map((pres) => getPresItem(pres)) : [];
                console.log("prescription hist 1", prescriptions)
                if (prescriptions.length > 0) {
                    console.log("prescription hist", prescriptions)
                    setLatest(prescriptions[0]);

                } else {
                    setLatest(null);
                }
            });
            fetchHistory(1);
        }

    }




    useEffect(() => {
        getPrescriptions()
    }, [clinic]);

    return <div style={{ width: '97%' }}> <Bookmarks data={clinics} setSelected={setClinic} selected={clinic}>
        <SnackbarProvider maxSnack={3} >
            <Fragment >
                <div className='pt-2 px-main-8'>
                    {clinic ? <ValidatorForm>
                        <Grid container spacing={2} className={classes.padded}>
                            <Grid item xs={9}>
                                <Latest patientInfo={patientInfo} latest={latest} old={history} favouritesItems={favouritesItems} favourites={favourites} clinic={clinic} patientClinic={patientClinic} allergedrugList={allergedrugList} fetchFavItem={fetchFavItem} warehouses={warehouses} pharmacies={pharmacies} />
                            </Grid>
                            <Grid item xs={3}>
                                <Previous history={history} page={historyPage} fetchHistory={fetchHistory} />
                            </Grid>
                        </Grid>
                    </ValidatorForm> : <div className={classes.centered}><CircularProgress /></div>}
                </div>
            </Fragment>
        </SnackbarProvider>
    </Bookmarks>
    </div>
}

Prescription.propTypes = {
}

export default withStyles(styles)(Prescription);