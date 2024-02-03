import axios from 'myaxios';
import * as apiroutes from '../../../apiroutes'
import localStorageService from '../localStorageService'

// Services of the clinic data setup is manager under this
class ClinicDataSetupService {
    //diagnosis api end points
    fetchAllDiagnosis = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CLINIC_DIAGNOSIS_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { limit: filterData.limit, page: filterData.page },
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

    //create new clinic diagnosis
    createNewClinicDiagnosis = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CLINIC_DIAGNOSIS_API, data, {
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

    //update clinic Diagnosis
    updateClinicDiagnosis = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CLINIC_DIAGNOSIS_API.concat(id), data, {
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

    //Complication Section
    fetchAllComplication = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CLINIC_COMPLICATION_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { limit: filterData.limit, page: filterData.page },
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

    //create new clinic complication
    createNewClinicComplication = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CLINIC_COMPLICATION_API, data, {
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

    //update clinic Complication
    updateClinicComplication = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CLINIC_COMPLICATION_API.concat(id), data, {
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

    //complaint section

    fetchAllCompliants = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CLINIC_COMPLAINTS_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { limit: filterData.limit, page: filterData.page },
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

    //create new clinic compliants
    createNewClinicCompliants = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CLINIC_COMPLAINTS_API, data, {
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

    //update clinic Complaints
    updateClinicComplaints = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CLINIC_COMPLAINTS_API.concat(id), data, {
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
}
export default new ClinicDataSetupService()
