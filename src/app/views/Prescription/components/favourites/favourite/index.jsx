import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import { useState } from 'react'
import { format } from 'date-fns'
import TableHead from './tableHead'
import TableFoot from './tableFoot'
import Row from './row'
import { Button, CircularProgress, Grid, Snackbar } from '@material-ui/core'
import { Alert } from '@mui/material'
import PrescriptionService from 'app/services/PrescriptionService'
import { useEffect } from 'react'
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import localStorageService from 'app/services/localStorageService'

const styles = {
    btnContainer: {
        display: 'flex',
        justifyContent: 'end',
        marginTop: 10,
        marginBottom: 10,
    },
    roundButton: {
        borderRadius: 20,
        padding: '5px 10px',
        background: '#06b6d4',
        color: 'white',
        margin: '1px',
        minWidth: '10em',
    },
    roundButtonOutline: {
        borderRadius: 20,
        padding: '5px 10px',
        background: 'white',
        border: '1px solid #06b6d4',
        color: '#06b6d4',
        margin: '1px',
        minWidth: '10em',
    },
}

const Favourites = (props) => {
    const { classes, latest, clinic, fetchFavItem } = props
    const [selectedDrug, setSelectedDrug] = useState(null)
    const [drugList, setDrugList] = useState([])
    const [loading, setLoading] = useState(false)
    const [viewSnack, setViewSnack] = useState('')
    const [snackType, setSnackType] = useState('')
    const [favName, setFavName] = useState('')
    const [favourites, setFavourites] = useState([])
    const vertical = 'bottom'
    const horizontal = 'left'

    const removeDrugByIndex = (index) => {
        const filtered = [...drugList].filter((item, pos) => pos !== index)
        setDrugList(filtered)
    }

    const fetchFav = async () => {
        var user = await localStorageService.getItem('userInfo')
        var doctor_id = user.id
        var Login_user_Clinic = await localStorageService.getItem('Login_user_Clinic_prescription')

        PrescriptionService.fetchFavourites({
            clinic_id: Login_user_Clinic?.clinic_id,
            doctor_id: user.roles.includes('Clinic Admin') ? null : doctor_id,
        }).then((favOut) => {
            if (favOut.data.view.data) {
                const favs = favOut.data.view.data.map((fav) => {
                    return { label: fav.name, value: fav.id }
                })
                setFavourites(favs)
            }
        })
    }

    useEffect(() => {
        fetchFav()
    }, [])

    useEffect(() => {
        if (latest) {
            setDrugList(latest.drugs)
        }
    }, [latest])

    const onSubmit = async () => {
        setLoading(true)
        const drugsArr = []
        drugList.forEach((drug) => {
            drug.quantity = 0
            drug.params.forEach((obj, index) => {
                drug.quantity += Math.ceil(
                    obj.duration * obj.dosage * (obj.frequency_val ?? 1)
                )
                drug.params[index].quantity = Math.ceil(
                    obj.duration * obj.dosage * (obj.frequency_val ?? 1)
                )
            })
            drug.drug_name = drug.drug
            drug.short_name = drug.short_name
            drugsArr.push(drug)
        })
        var user = await localStorageService.getItem('userInfo')
        var doctor_id = user.id
        var loginHospital = await localStorageService.getItem(
            'Login_user_Hospital'
        )

        var Login_user_Clinic = await localStorageService.getItem('Login_user_Clinic_prescription')

        const param = {
            clinic_id: Login_user_Clinic?.clinic_id,

            //patient_id: window.dashboardVariables.patient_id,
            doctor_remark: '',
            owner_id: loginHospital.owner_id,
            drugs: drugsArr,
            latest_update_date_time: new Date()
                .toJSON()
                .slice(0, 19)
                .replace('T', ' '),
            name: favName,
            type: 'Clinical Doctor',
        }

        if (user.roles.includes('Clinic Admin')) {

        } else {
            param.doctor_id = doctor_id
        }

        PrescriptionService.createFavourite(param)
            .then((out) => {
                console.log(out.status)
                if (out.status !== 200 && out.status !== 201) {
                    setSnackType('error')
                    setViewSnack('Error occured Status')
                } else {
                    setSnackType('success')
                    setViewSnack('Favourite submitted')
                    fetchFav()
                }
                setLoading(false)
            })
            .catch((e) => {
                setSnackType('error')
                setViewSnack('Error occured Exception')
                console.log(e)
                setLoading(false)
            })
    }

    return (
        <ValidatorForm>
            <Grid xs={2} style={{ marginBottom: '1.5em' }}>

                <LabeledInput label="Favourites" inputType="dropdown" data={favourites} onUpdate={(e, out) => {
                    setFavName(out ? out.label : "");
                    fetchFavItem(out);
                }} />
            </Grid>
            <Grid xs={2} style={{ marginBottom: '1.5em' }}>
                <LabeledInput
                    label="Name"
                    inputType="text"
                    value={favName}
                    onUpdate={(e) => setFavName(e.target.value)}
                />

            </Grid>
            <TableHead />
            {drugList.map((drug, index) => (
                <Row
                    key={index}
                    drug={drug}
                    index={index}
                    remove={removeDrugByIndex}
                    select={setSelectedDrug}
                    selected={selectedDrug}
                />
            ))}
            <TableFoot
                index={selectedDrug ?? drugList.length}
                drugList={drugList}
                select={setSelectedDrug}
                setDrugList={setDrugList}
                selectedDrug={
                    selectedDrug !== null ? drugList[selectedDrug] : null
                }
            />
            <div className={classes.btnContainer}>
                {!loading ? (
                    <Button className={classes.roundButton} onClick={onSubmit}>
                        Save Favourite
                    </Button>
                ) : null}
            </div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={viewSnack}
                autoHideDuration={3000}
                onClose={() => setViewSnack('')}
            >
                <Alert
                    onClose={() => setViewSnack('')}
                    severity={snackType}
                    sx={{ width: '100%' }}
                >
                    {viewSnack}
                </Alert>
            </Snackbar>
        </ValidatorForm>
    )
}

Favourites.propTypes = {}

export default withStyles(styles)(Favourites)
