import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class PatientClinicService {
    createNewPatientClinic = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_SINGLE_CLINIC_PATIENT, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error.response)
                    return resolve(error)
                })
        })
        return await promise
    }

   editPatientClinic = async (data,id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_SINGLE_CLINIC_PATIENT+id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error.response)
                    return resolve(error)
                })
        })
        return await promise
    }

    admitPatient = async (data,id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.patch(apiroutes.CREATE_SINGLE_CLINIC_PATIENT+id, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                       // "Content-Type": "multipart/form-data"
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }
}

export default new PatientClinicService()
