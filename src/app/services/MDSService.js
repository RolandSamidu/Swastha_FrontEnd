import localStorageService from "./localStorageService";
import axios from 'myaxios';
import * as apiroutes from "../../apiroutes";

class MDSService {

    //get all vehicles by owner ID
    getAllVehicles = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.VEHICLES_API.concat(`${id}`), {
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

    //get vehicle by id
    getVehicleByID = async ( owner_id, vehicle_id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.VEHICLES_API.concat(`${owner_id}/${vehicle_id}`), {
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

    //GET ORDER VEHICLES by order delivery id
    getAllOrderVehicles = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ORDER_DELIVERY_VEHICLE,
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

    //Add vehicle to order
    AddVehicleToOrder = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.ORDER_DELIVERY_VEHICLE, data, {
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

    // remove vehicle of order
    removeVehicle = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.ORDER_DELIVERY_VEHICLE + "/" + id, {
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

    //update Workers of vehicle
    UpdateVehicleWorkers = async (data,id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.ORDER_DELIVERY_VEHICLE.concat(`/${id}`), data, {
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
export default new MDSService()