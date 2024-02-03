import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { MainContainer, Widget } from "app/components/LoonsLabComponents";
import { Grid } from "@material-ui/core";
import PrescriptionService from "app/services/PrescriptionService";

const styleSheet = ((palette, ...theme) => ({
    title: {
        margin: 0
    },
    para: {
        margin: 0
    },
    historyContainer: {
        maxHeight: '50vh',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    historyItemContainer: {
        margin: '15px 10px'
    },
    historyItemHeader: {
        marginBottom: '20px',
        marginTop: '20px',
    },
    historyPrescription: {
        background: '#E7F9D2',
        border: '1px solid #b9b9b9'
    }
}));

const HistoryRow = ({ history, classes }) => {
    return <div className={classes.historyItemContainer}>
        <h5 className={classes.historyItemHeader}>{history.clinic} - {history.date}</h5>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <h6 className={classes.title}>Clinic No :</h6>
            </Grid>
            <Grid item xs={8}>
                <p className={classes.para}>{history.clinicNo}</p>
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <h6 className={classes.title}>Physician / Consultant :</h6>
            </Grid>
            <Grid item xs={8}>
                <p className={classes.para}>{history.consultant}</p>
            </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.historyPrescription}>
            <Grid item xs={4}>
                <h6 className={classes.title}>Prescription :</h6>
            </Grid>
            <Grid item xs={8}>
                <p className={classes.para}>{history.status}</p>
                <p className={classes.para}>{history.summary}</p>
            </Grid>
        </Grid>
    </div>
}

class PatientClinicHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            data: [],
            history: []
        }
    }

    fetchHistory() {
       /*  const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        }); */
        PrescriptionService.fetchPrescriptions({ 'order[0]': ['createdAt', 'DESC'], 'patient_id': this.props.patient_id, 'limit': 10,page:0 }).then((obj) => {
            const prescriptions = obj.data ? obj.data.view.data.map((pres) => {
                const date = new Date(pres.createdAt);
                return {
                    clinic: pres.Clinic ? pres.Clinic.name : "",
                    date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
                    clinicNo: pres.Clinic ? pres.Clinic.id : "",
                    consultant: pres.Doctor ? pres.Doctor.name : "",
                    status: pres.status,
                    summary: `${pres.DrugAssign ? pres.DrugAssign.length : 0} drugs(Indoor) and 0 drugs(Outdoor)`
                }
            }) : [];
            this.setState({
                history: prescriptions
            });
        });
    }

    componentDidMount() {
        this.fetchHistory();
    }

    render() {
        const { classes } = this.props;
        return (
             <Fragment>
                    <MainContainer>
                        <div className={classes.historyContainer}>
                            {
                                this.state.history.map((item) => <HistoryRow history={item} classes={classes} />)
                            }
                        </div>
                    </MainContainer>
                </Fragment>
        );
    }
}

export default withStyles(styleSheet)(PatientClinicHistory);