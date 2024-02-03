import axios from 'myaxios';
import * as apiroutes from '../../../apiroutes'
import localStorageService from '../localStorageService'

class ItemMasterService {
    fetchAllBatchTrace = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.BATCH_TRACE_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    createBatchTrace = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.BATCH_TRACE_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    updateBatchTrace = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.BATCH_TRACE_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createCondition = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CONDITION_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllCondition = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONDITION_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateCondition = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CONDITION_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createCyclicCodes = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CYCLIC_CODES_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllCyclicCodes = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CYCLIC_CODES_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateCyclicCodes = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CYCLIC_CODES_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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


    createInstitution = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.INSTITUTION_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllInstitution = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.INSTITUTION_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateInstitution = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.INSTITUTION_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createItemType = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.ITEM_TYPE_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllItemTypes = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ITEM_TYPE_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateItemType = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.ITEM_TYPE_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createItemUsageType = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.ITEM_TYPE_USAGE_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllItemUsageTypes = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ITEM_TYPE_USAGE_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateItemUsageType = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.ITEM_TYPE_USAGE_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createMovementType = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.MOVEMENT_TYPE_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllMovementTypes = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.MOVEMENT_TYPE_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateMovementType = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.MOVEMENT_TYPE_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createShelfLife = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SHELF_LIFE_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllShelfLife = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SHELF_LIFE_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateShelfLife = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SHELF_LIFE_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createStock = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.STOCKS_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllStocks = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.STOCKS_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateStock = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.STOCKS_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createStorage = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.STORAGES_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    fetchAllStorages = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.STORAGES_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateStorage = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.STORAGES_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createUOM = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.UOMS_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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
    
    fetchAllUOMs = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.UOMS_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateUOM = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.UOMS_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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
    
    createVEN = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.VENS_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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
    
    fetchAllVENs = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.VENS_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateVEN = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.VENS_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createABCClass = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.ABC_CLASS_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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
    
    fetchAllABCClasses = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ABC_CLASS_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData
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

    updateABCClass = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.ABC_CLASS_API + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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
    delBatchtrace = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.BATCH_TRACE_API + "/" + data, {
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

export default new ItemMasterService()
