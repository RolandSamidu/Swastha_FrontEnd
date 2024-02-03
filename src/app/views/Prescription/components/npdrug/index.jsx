import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { MainContainer, Widget } from 'app/components/LoonsLabComponents';
import { CircularProgress, Grid } from '@material-ui/core';
import NPDrug from './npdrug';
import Bookmarks from 'app/components/LoonsLabComponents/Bookmarks';
import { useState } from 'react';
import PrescriptionService from 'app/services/PrescriptionService';
import { SnackbarProvider } from 'notistack';

const styles = {
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
}

const Prescription = (props) => {
    const { classes } = props;

    const [clinics, setClinics] = useState([]);
    const [frequencies, setFrequencies] = useState([]);

    const [clinic, setClinic] = useState(null);
    const [fav, setFav] = useState(null);

    const fetchClinics = () => {
        PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': window.dashboardVariables.patient_id }).then((obj) => {
            if (obj.data) {
                const clinics = obj.data.view.data.map((clinic) => ({
                    id: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.short_reference : 'N/A',
                    name: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.name : 'N/A',
                    clinic_id: clinic.Pharmacy_drugs_store ? clinic.Pharmacy_drugs_store.id : 'N/A',
                }));
                setClinics(clinics);
                if (clinics.length > 0) {
                    setClinic(clinics[0]);
                }
            }
        });
    }

    const getFavItem = (pres) => {
        const date = new Date();
        return {
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            drugs: pres.map((drug) => {
                return {
                    drug_id: drug.drug_id,
                    type: '',
                    route: drug.ItemSnap && drug.ItemSnap.DefaultRoute ? drug.ItemSnap.DefaultRoute.name : 'Oral',
                    drug: drug.drug_name,
                    uom: drug.ItemSnap && drug.ItemSnap.ItemUOM && drug.ItemSnap.ItemUOM.UOM ? drug.ItemSnap.ItemUOM.UOM.name : "mg",
                    quantity: drug.quantity,
                    issued_quantity: drug.issued_quantity,
                    params: drug.AssignItems ? drug.AssignItems.map((param) => {
                        return {
                            frequency: param.frequency,
                            duration: param.duration,
                            dosage: param.dosage,
                            remark: param.doctor_remark ?? null,
                            quantity: param.quantity ?? 0
                        }
                    }) : []
                }
            })
        }
    }

    const fetchFavItem = (obj) => {
        if (obj) {
            PrescriptionService.fetchFavourite({ prescription_id: obj.value })
                .then((favOut) => {
                    if (favOut.data.view.data) {
                        const obj = favOut.data.view.data;
                        setFav(getFavItem(obj))
                    }
                });
        }
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

    useEffect(() => {
        fetchFrequencies();
    }, []);

    useEffect(() => {
        fetchClinics();
    }, [frequencies]);

    return <SnackbarProvider maxSnack={3}>
        <Widget title="Add New NP Drug Order for Patient" id="NP Drug">
            <Fragment>
                <MainContainer>
                    {clinic ? <Grid container spacing={2} className={classes.padded}>
                        <Grid item xs={12}>
                            <NPDrug latest={fav} clinic={clinic} fetchFavItem={fetchFavItem} />
                        </Grid>
                    </Grid> : <div className={classes.centered}><CircularProgress /></div>}
                </MainContainer>
            </Fragment>
        </Widget>
    </SnackbarProvider>
}

Prescription.propTypes = {
}

export default withStyles(styles)(Prescription);