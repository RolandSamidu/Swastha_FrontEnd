import localStorageService from './localStorageService'
import axios from 'myaxios'
import * as apiroutes from '../../apiroutes'
import { reject } from 'lodash'

class SPCServices {
    getAllPurchaseOrders = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PURCHASE_ORDER, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getPurchaseOrderByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PURCHASE_ORDER + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getAllDebitNotes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_DEBIT_NOTE, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getAllDebitNoteByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_DEBIT_NOTE + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getAllPurchaseApprovals = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_ORDER_APPROVAL, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getPurchaseApprovalByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_ORDER_APPROVAL + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getDebitNoteByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_DEBIT_NOTE + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createDebitNote = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_DEBIT_NOTE, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    fetchNewChargesDebitNote = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_DEBIT_NOTE + "/" + id, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createPOReSubmission = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_PURCHASE_ORDER_RESUBMISSION, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeDebitNoteChargesByID = async (id, data) => {
        try {
            const accessToken = await localStorageService.getItem('accessToken');
            const response = await axios.patch(apiroutes.SPC_DEBIT_NOTE_CHARGES + `/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });



            console.log('Response:', response.data);
            return response;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error; // Re-throw the error to be handled at the caller level if needed
            console.error('API Request Error:', error);
            throw error; // Re-throw the error to be handled at the caller level if needed
        }


    };


    changePurchaseOrderApproval = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_ORDER_APPROVAL + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getPurchaseOrderByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PURCHASE_ORDER + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getAllBanks = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_BANK_DETAILS, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getAllSPCPOItem = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PO_ITEM, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getAllConditions = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_SHIPMENT_CONDITIONS, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getShippingConditions = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_CONDITIONS, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    createShippingConditions = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_CONDITIONS, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeShippingConditions = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_CONDITIONS + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    deleteShippingConditions = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.SPC_CONSIGNMENT_CONDITIONS + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeSPCPOItem = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_PO_ITEM + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    deleteSPCPOItem = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.SPC_PO_ITEM + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createSPCPOItem = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_PO_ITEM, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getAllSPCPODeliverySchedules = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PO_ITEM_DELIVERY_SCHEDULES, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getAllSPCPOPackingDetails = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PO_ITEM_PACKING_DETAILS, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    createSPCPODeliverySchedules = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_PO_ITEM_DELIVERY_SCHEDULES, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createSPCPOPackingDetails = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_PO_ITEM_PACKING_DETAILS, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeSPCPODeliverySchedules = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_PO_ITEM_DELIVERY_SCHEDULES + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    deleteSPCPODeliverySchedules = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.SPC_PO_ITEM_DELIVERY_SCHEDULES + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeSPCPOPackingDetails = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_PO_ITEM_PACKING_DETAILS + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    deleteSPCPOPackingDetails = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.SPC_PO_ITEM_PACKING_DETAILS + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getPurchaseOrder = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PURCHASE_ORDER + '/' + id, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createPurchaseOrder = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_PURCHASE_ORDER, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changePurchaseOrder = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_PURCHASE_ORDER + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createConsignment = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_ORDER, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getConsignmentApprovals = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_APPROVAL, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getConsignmentApprovalByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_APPROVAL + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeConsignmentApproval = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_APPROVAL + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    getConsignment = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_ORDER, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    // get data itemwise
    getConsignmentbyId = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_ORDER + '/' + id, {
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
                    return reject(error)
                })
        })
        return await promise
    }

    getConsignmentByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_ORDER + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeConsignmentByID = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_ORDER + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeConsignmentVesselByID = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_VESSEL + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createConsignmentVessel = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_VESSEL, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeConsignmentContainerByID = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_CONTAINER + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createConsignmentContainer = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_CONTAINER, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createConsignmentCharges = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_CHARGES, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeConsignmentChargesByID = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_CHARGES + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createConsignmentResubmission = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_RESUBMISSION, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    createConsignmentItems = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_CONSIGNMENT_ITEMS, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeConsignmentItemById = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_CONSIGNMENT_ITEMS + `/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    deleteConsignmentItemById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.SPC_CONSIGNMENT_ITEMS + `/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

    changeDebitNoteStatus = async (data, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.SPC_DEBIT_NOTE_STATUS + '/' + id, data, {
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

    updateNewAdditionalCharge = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_UPDATE_DEBIT_NOTE_CHARGES, data, {
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

    updateNewAdditionalChargeForMA = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_UPDATE_DEBIT_NOTE_CHARGES + "/" + id, data, {
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

    updateNewAdditionalChargeForSupervisor = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_UPDATE_DEBIT_NOTE_CHARGES + "/" + id, data, {
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

    updateNewAdditionalChargeForManager = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.SPC_UPDATE_DEBIT_NOTE_CHARGES + "/" + id, data, {
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


    editDebitNoteApproval = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_DEBIT_NOTE_RESUBMIT, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }
    updatePoOrderListItem = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.SPC_PO_UPDATE_ORDER_LIST_ITEM + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error ---', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getPOItemHistory = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_PO_ORDER_LIST_HISTORY, {
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
                    return reject(error)
                })
        })
        return await promise
    }


    editDebitNoteApproval = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.SPC_DEBIT_NOTE_RESUBMIT, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return reject(error)
                })
        })
        return await promise
    }

}

export default new SPCServices()
