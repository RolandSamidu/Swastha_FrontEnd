import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class WarehouseServices {

    getWarehoure = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_WAREHOUSE.concat('/000'),
                    {
                        params: params,
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

    getWarehoureWithOwnerId = async (owner_id,params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_WAREHOUSE.concat(`/${owner_id}`),
                    {
                        params: params,
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

    getAllWarehouses = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_WAREHOUSE.concat('/null'),
                    {
                        params: params,
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

    getWarehoureById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_WAREHOUSE.concat('/000/', id),
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

    warehoureItemAllocation = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.WAREHOUSE_ITEM_ALLOCATION, data,
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

    
    getwarehoureItemAllocation = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.WAREHOUSE_ITEM_ALLOCATION,
                    {
                        params: params,
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

    editWarehoureItemAllocation= async (data,id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.WAREHOUSE_ITEM_ALLOCATION + '/'+ id ,data, {
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


    getVEN = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.VENS,
                    {
                        params: params,
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
    getStocks = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.STOCKS,
                    {
                        params: params,
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

    getConditions = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.CONDITIONS,
                    {
                        params: params,
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
    getStorages = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.STORAGES,
                    {
                        params: params,
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

    getBatchTraces = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.BATCH_TRACES,
                    {
                        params: params,
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

    getABCClasses = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.ABC_CLASSES,
                    {
                        params: params,
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

    getCyclicCodes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.CYCLIC_CODES,
                    {
                        params: params,
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

    getMovementTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.MOVEMENT_TYPES,
                    {
                        params: params,
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

    getItemTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.ITEM_TYPES,
                    {
                        params: params,
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

    getInstitutions = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.INSTITUTIONS,
                    {
                        params: params,
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
    getItemUsageTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.ITEM_USAGE_TYPES,
                    {
                        params: params,
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

    getBinTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.BIN_TYPES,
                    {
                        params: params,
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
    getBinAllocations = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.BIN_ALLOCATION_DATA,
                    {
                        params: params,
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

    binAllocations = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.BIN_ALLOCATION_DATA,data,
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

    orderItemsUpload = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.UPLOAD_ORDERS,data,
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

    getWareHouseUsers = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_WAREHOUSE_USERS, {
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

    getRouteStops = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ROUTE_STOPS, {
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

    createRoute = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.CREATE_ROUTE,data,
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

    createRouteBulk = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.CREATE_ROUTE+"/insertbulk",data,
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

    getRoutes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.CREATE_ROUTE,
                    {
                        params:params,
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

    getSingleRoutes = async (id,params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.CREATE_ROUTE+'/'+id,
                    {
                        params:params,
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

    deleteRouteStop = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.ROUTE_STOPS + "/" +id, {
                    data:data,
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

    getWarehousesBinsById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_WAREHOUSE + `/null/${id}`,
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
    getWarehousesBinsByIdwithParams = async (id,params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_WAREHOUSE + `/null/${id}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        params:params,
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


    //MSD-Warehouose -navindu

    getAllWarehousebyIDwithOwner= async (id,owner_id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_WAREHOUSE + '/'+ owner_id + "/" + `${id}`, {
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
    getAllWarehousewithOwner = async (params,owner_id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_WAREHOUSE + '/'+ owner_id , {
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
    getAllWarehouseBins = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.WAREHOUSE_BINS,
                    {
                        params: params,
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
    updateWarehouseBins = async (owner_id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.WAREHOUSE_BINS + '/'+ owner_id ,data, {
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
    getAllBinTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.WAREHOUSE_BINS_TYPES,
                    {
                        params: params,
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
    addWarehouseItemBulk = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.ADD_BULK_ITEMS, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
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
    getDefaultItems = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.DEFAULT_ITEMS,{
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


    getDefaultUserItems = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.DEFAULT_USER_ITEMS,{
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
  
    addUserItemsBulk = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.DEFAULT_USER_ITEMS_BULK, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
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

    getOtherWareHouses = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.OTHER_WAREHOUSES, {
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

    requestDrugExchange = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.ORDER_EXCHANGES, data,
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

    getDrugExchanges = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.INDIVIDUAL_ORDER_ITEMS, {
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

    orderItemEdit = async (data,id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.INDIVIDUAL_ORDER_ITEMS + '/'+ id ,data, {
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


    drugBalancing = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .post(
                    apiroutes.DRUG_BALANCING, data,
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

    getDrugBalancing = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.DRUG_BALANCING, {
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

    getAdditionalData = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.ADDITIONAL_DATA, {
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
    
    getDrugReport = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ITEM_SNAP_BATCH_WAREHOUSE, {
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
    getSingleItemWarehouse = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SINGLE_ITEM_WAREHOUSE,{
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

    getConsumptionDetails = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_CONSUMPTIONS_DET,{
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

    getWarehouseHistories = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.WAERHOUSE_HISTORIES,{
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

    getOrderPosition = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ORDER_POSITION,{
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
  
    getAllItemWarehouse = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ALL_ITEM_WAREHOUSES, {
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
    createBinType = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.WAREHOUSE_BINS, data, {
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
    getAllHigherLevels = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_HIGHER_LEVELS, {
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
    DeleteHigherLevel = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.GET_HIGHER_LEVELS + "/" +id, {
                    data:data,
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
    createNewHigherLevel = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.GET_HIGHER_LEVELS, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
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
    DeleteWarehouseItem = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.DEFAULT_ITEMS+"/"+id, {
                    data:data,
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
    editStatusReorderItems = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.INDIVIDUAL_ORDER_ITEMS + "/status/" + `${id}`, data, {
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
    returnRequest = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.GET_ALL_RETURN_REQUESTS, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
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
  
    getCurrentStockLevel = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.DEFAULT_ITEMS + "/" +id, {
                    
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
    getAllocationLedger = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.ALLOCATION_LEDGER,
                    {
                        params: params,
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

    getAllPurchaseOrderItems = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_ALL_ITEMS,
                    {
                        params: params,
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

    getAllPurchaseOrderItemById = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.GET_ALL_ITEMS+'/'+id,
                    {
                        params: params,
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

   
}
export default new WarehouseServices()
