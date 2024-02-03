import localStorageService from './localStorageService'
import axios from 'myaxios'
import * as apiroutes from '../../apiroutes'

class PreProcumentService {
    getAllOrderLists = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.PRE_PROCUREMENT_ORDERS, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    getSingleOrderLists = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')

        const URL = apiroutes.PRE_PROCUREMENT_SINGLE_ORDERS_LIST

        const promise = new Promise((resolve, reject) => {
            axios
                .get(URL, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    getApprovalList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.PRE_PROCUREMENTS_APPROVAL, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    getCurrentItemList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.PRE_PROCUREMENT_CURRENT_ITEM_LIST, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    getHistoryChart = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.PRE_PROCUREMENT_HISTORY_CHART, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    getPreviousItemList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.PRE_PROCUREMENT_PREVIOUS_ITEM_LIST, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    getApprovalConfigs = async () => {
        const accessToken = await localStorageService.getItem('accessToken')
        const url = apiroutes.PRE_PROCUREMENTS_APPROVAL_CONFIGS

        const promise = new Promise((resolve, reject) => {
            axios
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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
    approvalStatusUpdate = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')

        const url = `${apiroutes.PRE_PROCUREMENTS_APPROVAL}/${id}`
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(url, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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
export default new PreProcumentService()
