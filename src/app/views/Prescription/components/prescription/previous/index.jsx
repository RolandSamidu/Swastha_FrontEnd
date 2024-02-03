import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { MainContainer, Widget } from 'app/components/LoonsLabComponents';
import PrevDates from './dates';
import { useState } from 'react';
import Header from './header';
import Row from './row';
import { useEffect } from 'react';
import { LinearProgress } from '@mui/material';

const styles = {
    prevContainer: {
        width: '100%',
    },
}

const PreviousPrescriptions = (props) => {
    const { classes, history, fetchHistory, page } = props;
    const [selected, setSelected] = useState(history.length > 1 ? 1 : 0);
    const dates = history.map((item) => item.date);
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshHistory = () => {
        setLoading(false);
        if (history.length > 1 && history[selected]) {
            const latest = history[0]?.drugs;
            const selectedDrugs = history[selected]?.drugs;
            const rearranged = {
                date: history[selected]?.date,
                doctor: history[selected]?.doctor,
                drugs: []
            };
            const drug_ids = [];
            for (let i = 0; i < latest.length; i++) {
                const filtered = selectedDrugs?.filter((detail) => detail.drug_id === latest[i].drug_id);
                drug_ids.push(latest[i].drug_id);
                if (filtered.length > 0) {
                    const arr = [];
                    for (let j = 0; j < filtered[0].params.length; j++) {
                        arr.push({drug:filtered[0].short_name, dosage: `${filtered[0].params[j].dosage.replace(/[.,]00$/, "")} ${filtered[0].uom}`, frequency: filtered[0].params[j].frequency, duration: filtered[0].params[j].duration });
                    }
                    rearranged.drugs.push({ height: latest[i].params.length, rows: arr });
                } else {
                    rearranged.drugs.push({ height: latest[i].params.length, rows: [] });
                }
            }
            for (let k = 0; k < selectedDrugs.length; k++) {
                if (!drug_ids.includes(selectedDrugs[k].drug_id)) {
                    const arr = [];
                    for (let l = 0; l < selectedDrugs[k].params.length; l++) {
                        arr.push({drug:selectedDrugs[k].short_name, dosage: `${selectedDrugs[k].params[l].dosage.replace(/[.,]00$/, "")} ${selectedDrugs[k].uom}`, frequency: selectedDrugs[k].params[l].frequency, duration: selectedDrugs[k].params[l].duration });
                    }
                    rearranged.drugs.push({ height: selectedDrugs[k].params.length, rows: arr });
                }
            }
            setPrescription(rearranged);
        } else {
            setPrescription(null);
        }
    }

    useEffect(() => {
        if (history) {
            refreshHistory();
            setSelected(history.length > 1 ? 1 : 0);
        }
    }, [history]);

    useEffect(() => {
        refreshHistory();
    }, [selected]);

    return !loading ? (prescription ? <div className="w-full mt-5">
        <PrevDates dates={dates} selected={selected} setSelected={setSelected} page={page} fetchHistory={fetchHistory} />
        <Header date={prescription.date} doctor={prescription.doctor} />

        {
            prescription ? prescription.drugs.map((drug, index) => <Row key={index} texts={drug} index={index} />) : null
        }
    </div> : <p>No previous prescriptions</p>): <LinearProgress color='secondary' />
}

PreviousPrescriptions.propTypes = {
}

export default withStyles(styles)(PreviousPrescriptions);