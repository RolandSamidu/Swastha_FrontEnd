import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class PharmacyService {
    //save pharmacy to the wherehouse end point
    createPharmacy = async (data, owner_id) => {
        console.log(owner_id);
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GET_DATA_STORE_PHARMACY + owner_id, data, {
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

    // update ward
    updateWard = async (owner_id, id, data) => { 
        // console.log('updated data', data,' ', id, ' ', owner_id )
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.GET_DATA_STORE_PHARMACY+owner_id+'/'+id,data, {
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

    getPharmacy = async (owner_id, params) => { 

        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DATA_STORE_PHARMACY + owner_id + '/', {
                    params: params,
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

    getPharmacyById = async (id, owner_id, params) => {
        console.log("owner_id ", owner_id)
        console.log("params ", params)
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DATA_STORE_PHARMACY + owner_id + `/${id}/`, {
                    params: params,
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

    getPharmacyByIdCloud= async (id, owner_id, params) => {
        console.log("owner_id ", owner_id)
        console.log("params ", params)
        let accessToken = await localStorageService.getItem('accessToken_cloud')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DATA_STORE_PHARMACY_CLOUD + owner_id + `/${id}/`, {
                    params: params,
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
    // TODO - Clarify whethere same end point is used to retrieve pharamacy and data store
    fetchAllDataStorePharmacy = async (owner_id, params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .get(apiroutes.GET_DATA_STORE_PHARMACY + owner_id, {
                    params: params,
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
        return await a
    }

    fetchHierachy = async (id, owner_id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_DATA_STORE_PHARMACY + owner_id + '/hierachy/' + id,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                )
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await a
    }

    fetchOneById = async (id, owner_id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DATA_STORE_PHARMACY + owner_id + '/' + id, {
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
        return await a
    }

    fetchIssuedDrugs = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        console.log("params ", params)
        const a = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ISSUED_DRUGS, {
                    params: params,
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
        return await a
    }


   assignPharmacist = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.GET_ALL_FRONT_DESK, data, {
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

    getDrugStocks = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.ITEM_SNAP_BATCH_WAREHOUSE_SUM, data, {
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

    issuePrescription = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.ISSUE_PRESCRIPTION, data, {
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

    referPrescription = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.REFER_PRESCRIPTION + id, data, {
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
export default new PharmacyService()
