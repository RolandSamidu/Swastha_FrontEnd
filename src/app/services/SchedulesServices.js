import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'
import { CONSIGNMENT_REDO_REASONS, CONSIGNMENT_SAMPLES_API } from "../../apiroutes";

class SchedulesServices {
    //get the consignment order list
    getScheduleOrderList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.ORDER_SCHEDULES, {
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


    // get oder list using is
    getOrderListByID = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .get(apiroutes.PURCHASE_ORDER_SCHEDULES+'/'+id, {
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


    putOrderListByID = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.PURCHASE_ORDER_SCHEDULES + "/status/" + `${id}`, data, {
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

    // get oder list using is
    getOrderListHistory = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .get(apiroutes.ORDER_LIST_HISTORIES, {
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

    getOrderListApprovals = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .get(apiroutes.ORDER_LIST_APPROVALS, {
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

    // Change PURCHASE_ORDER_SCHEDULES -> PRE_PROCUREMENT_ORDERS
    getOrderList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .get(apiroutes.PURCHASE_ORDER_SCHEDULES, {
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

    changeOrderListApprovals = async (data, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .patch(apiroutes.ORDER_LIST_APPROVALS + `/${id}`, data, {
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
}
export default new SchedulesServices()
