import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class PatientServices {
    createNewPatient = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_SINGLE_PATIENT, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    patchPatient = async (data, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_SINGLE_PATIENT + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getAllPatient = async (params) => {
        /*      const accessToken = await localStorageService.getItem("accessToken");
             const a = new Promise((resolve, reject) => {
                 axios.get(apiroutes.GET_ALL_STUDENTS,
                     {
                         params: params,
                         headers: { Authorization: `Bearer ${accessToken}` }
                     }).then(res => {
                         return resolve(res);
                     })
                     .catch((error) => {
                         console.log("error", error);
                         return resolve(error);
                     })
             });
             return await a;
         */
    }
    getPatientInfo = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PATIENTS_INFO,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await a;

    }

    getPatientById = async (id,params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_SINGLE_PATIENT+id,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await a;

    }//clinic patient
    getPatientByIdClinic = async (id,params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.FETCH_PATIENT_BYID+id,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await a;

    }
    getMidnightReports = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.FETCH_PATIENT_BYID,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await a;

    }
    patchPatientByIdClinic = async (data, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.FETCH_PATIENT_BYID + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    fetchPatientsByAttribute = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.FETCH_PATIENTS, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: params,
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    fetchPatientsFromCloudByAttribute = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken_cloud')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.FETCH_PATIENTS_FROM_CLOUD, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: params,
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    fetchClinicWardPatientsByAttribute = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CREATE_SINGLE_CLINIC_PATIENT, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: params,
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getAllFront_Desk = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_FRONT_DESK, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: params,
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getAllReasons = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.FETCH_REASONS, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: params,
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }
    getDiagnosis = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DIAGNOSIS_TYPES,
                    {
                        params: params,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    } 
    getDiagnosisbyID = async (params,id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DIAGNOSIS_TYPES+id,
                    {
                        params: params,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }
    sendingEMMR = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_SINGLE_CLINIC_PATIENT+'/send', data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    validateFromEMMR = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_VALIDATION_EMMR,
                    {
                        params: params,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    } 
    getSuccessList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_SUCESSLIST,
                    {
                        params: params,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    } 



}
export default new PatientServices()
