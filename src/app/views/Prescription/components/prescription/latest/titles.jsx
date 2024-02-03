import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import PharmacyService from 'app/services/PharmacyService';

const styles = {
    titleContainer: {
        height: '5em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    h5s: {
        marginBottom: '0.25em',
        lineHeight: 1,
        color: '#374151'
    },
    para: {
        margin: 0,
        fontSize: '0.9em',
        color: '#bdbdbd'
    }
}



const Titles = (props) => {
    const { classes, clinic, title, date, clinicAll } = props;
    const [hospital, setHospital] = useState('');

    const getHospitalById = async () => {

        if (clinicAll.hospital_view) {
            PharmacyService.getPharmacyByIdCloud(clinicAll.hospital_id, clinicAll.owner_id, { issuance_type: 'hospital' }).then(async (obj) => {
                if (obj.status == 200) {
                    console.log("hospital", obj.data.view.name);
                    setHospital(obj.data.view.name)

                }
            });
        }
    }


    useEffect(() => {
        getHospitalById()
    }, []);
    return <div className={classes.titleContainer}>
        <h5 className={classes.h5s}>{title}</h5>
        <h5 className={classes.h5s}>{clinic}</h5>
        <h5 className={classes.h5s}>{hospital}</h5>
        <p className={classes.para}>{date}</p>
    </div>
}

Titles.propTypes = {
}

export default withStyles(styles)(Titles);